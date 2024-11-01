'use client';

import { useParams } from "next/navigation";
import { useOrder } from "./_hooks/useOrder";
import { useMemo } from "react";
import { Order } from "@/lib/types/Zod/Order";

const UserOrderIdPage = () => {
  const params = useParams();
  const orderId = params.id;

  const orderQuery = useOrder(orderId as string);
  const order = useMemo(() => orderQuery.data || {}, [orderQuery.data]) as Order;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <h1>OrderId</h1>
    </div>
  )
}

export default UserOrderIdPage;