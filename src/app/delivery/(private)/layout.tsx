'use client';

import { AcceptOrderDialog, NewOrder } from "@/components/Modals/AcceptOrder";
import { useEffect } from "react";
import { useSocket } from "./_hooks/useSocket";
import { useUser } from "@/hooks/useUser";

const DeliveryPrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      const handleNewOrder = async (order: NewOrder) => {
        try {
          await AcceptOrderDialog({ order });
          socket.emit('order-took', { order, userId: user._id! });
        } catch (e) {
          console.error(e);
        }
      };

      socket.on('new-order', handleNewOrder);

      return () => {
        socket.off("order-update", handleNewOrder);
      };
    }
  }, [socket]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      {children}
    </div>
  );
};

export default DeliveryPrivateLayout;
