'use client';

import { useUser } from "@/hooks/useUser";
import { User } from "@/lib/types/Zod/User";
import ky from "ky";
import { useEffect } from "react";

const DeliveryPrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useUser();

  const getUser = async () => {
    const { data } = await ky.get('/api/delivery/user').json() as { data: User, error?: string };
    setUser(data);
  }

  useEffect(() => {
    getUser();
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col">
      {children}
    </div>
  )
};

export default DeliveryPrivateLayout;