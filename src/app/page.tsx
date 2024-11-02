"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleAdminClick = () => {
    router.push('/admin/dashboard')
  }

  const handleUserClick = () => {
    router.push('/user/dashboard')
  }

  return (
    <div className="relative">
      <header
        className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between"
      >
        <div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size={"sm"} onClick={handleAdminClick}>
            Soy un administrador
          </Button>
          <Button size={"sm"} onClick={handleUserClick}>
            Iniciar sesión
          </Button>
        </div>
      </header>
    </div>
  );
}
