import { io, Socket } from 'socket.io-client';
import dotenv from 'dotenv';

dotenv.config();

const socketInstances: Record<string, Socket | null> = {
  admin: null,
  user: null,
  deliveryUser: null,
};

export const getSocketForRole = (role: 'admin' | 'user' | 'deliveryUser', userId: string): Socket => {
  if (!socketInstances[role]) {
    socketInstances[role] = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      auth: {
        token: 'test',
        userId,
        role,
      },
    });

    socketInstances[role]?.on('connect', () => {
      console.log(`${role} conectado con socket ID: ${socketInstances[role]?.id}`);
    });

    socketInstances[role]?.on('disconnect', () => {
      console.log(`${role} desconectado`);
    });
  }

  return socketInstances[role]!;
};

export const disconnectSocketForRole = (role: 'admin' | 'user' | 'deliveryUser') => {
  if (socketInstances[role]) {
    socketInstances[role]?.disconnect();
    socketInstances[role] = null;
  }
};