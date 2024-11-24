'use client';

import { AcceptOrderDialog } from "@/components/Modals/AcceptOrder";
import { useUser } from "@/hooks/useUser";
import { getSocketForRole } from "@/lib/socket";
import { User } from "@/lib/types/Zod/User";
import ky from "ky";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

const DeliveryPrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser } = useUser();
  const socketRef = useRef<Socket | null>(null);

  const getUser = async () => {
    const { data } = await ky.get('/api/delivery/user').json() as { data: User, error?: string };
    setUser(data);
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (Object.keys(user).length > 0 && !socketRef.current) {
      const socket = getSocketForRole('deliveryUser', user._id!);
      socketRef.current = socket;

      socket.on('new-order', async (order) => {
        console.log(order, 'order');
        await AcceptOrderDialog();
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('order-paid');
        socketRef.current = null;
      }
    };
  }, [user]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      {children}
    </div>
  );
};

export default DeliveryPrivateLayout;
