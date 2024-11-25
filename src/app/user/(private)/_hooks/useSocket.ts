import { getSocketForRole } from "@/lib/socket";
import { User } from "@/lib/types/Zod/User";
import ky from "ky";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  const setSocket = async() => {
    const { data } = await ky.get('/api/user/user').json() as { data: User, error?: string };
    const socket = getSocketForRole('user', data._id!);
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