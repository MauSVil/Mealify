import { useUser } from "@/hooks/useUser";
import { getSocketForRole } from "@/lib/socket";
import { User } from "@/lib/types/Zod/User";
import ky from "ky";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

export const useSocket = () => {
  const { setUser } = useUser();
  const socketRef = useRef<Socket | null>(null);

  const setSocket = async() => {
    const { data } = await ky.get('/api/delivery/user').json() as { data: User, error?: string };
    setUser(data);
    const socket = getSocketForRole('deliveryUser', data._id!);
    socketRef.current = socket;
  };

  useEffect(() => {
    setSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current = null;
      }
    };
  }, []);

  return socketRef.current;
};