'use client';

import Link from "next/link"
import {
  CircleUser,
  Menu,
  Package2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClients } from "./_hooks/useClients";
import { useEffect, useMemo, useState } from "react";
import { Business } from "@/lib/types/Zod/Business";
import Cookies from "js-cookie";

type Props = {
  children: React.ReactNode
}

const PrivateAdminLayout = (props: Props) => {
  const { children } = props;
  const [selectedBusiness, setSelectedBusiness] = useState<string | undefined>(undefined);

  const router = useRouter()
  const pathname = usePathname();
  const currentPaths = pathname.split("/")
  const currentPath = currentPaths?.[2]

  const clientsQuery = useClients();
  const clients = useMemo(() => clientsQuery.data?.data || [], [clientsQuery.data]) as Business[];

  const handleBusinessSelectChange = (value: string) => {
    Cookies.set('business', value);
    router.refresh();
    setSelectedBusiness(value);
    window.location.reload();
  };

  useEffect(() => {
    const business = Cookies.get('business');
    if (business) {
      setSelectedBusiness(business);
    } else {
      setSelectedBusiness(clients[0]?._id);
      Cookies.set('business', clients[0]?._id || '');
    }
  }, [clients])

  const handleLogout = () => {
    Cookies.remove('business');
    Cookies.remove('atoken');
    router.push('/admin/sign-in');
  }

  const handleNewBusinessClick = () => {
    router.push('/admin/new-business')
  }

  const handleSettingsClick = () => {
    router.push(`/admin/business/${selectedBusiness}`)
  }

  const handleEditBusinessClick = () => {
    router.push(`/admin/edit-business/${selectedBusiness}`)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <div
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
            onClick={() => console.log('click')}
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </div>
          <p
            className={cn("cursor-pointer text-muted-foreground transition-colors hover:text-foreground", {
              "text-foreground": currentPath === "dashboard"
            })}
            onClick={() => router.push('/admin/dashboard')}
          >
            Dashboard
          </p>
          <p
            className={cn("cursor-pointer text-muted-foreground transition-colors hover:text-foreground", {
              "text-foreground": currentPath === "orders"
            })}
            onClick={() => router.push('/admin/orders')}
          >
            Orders
          </p>
          <p
            className={cn("cursor-pointer text-muted-foreground transition-colors hover:text-foreground", {
              "text-foreground": currentPath === "products"
            })}
            onClick={() => router.push('/admin/products')}
          >
            Products
          </p>
          <p
            className={cn("cursor-pointer text-muted-foreground transition-colors hover:text-foreground", {
              "text-foreground": currentPath === "customers"
            })}
          >
            Customers
          </p>
          <p
            className={cn("cursor-pointer text-muted-foreground transition-colors hover:text-foreground", {
              "text-foreground": currentPath === "analytics"
            })}
          >
            Analytics
          </p>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link href="#" className="hover:text-foreground">
                Dashboard
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Orders
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Products
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Customers
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Analytics
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
            <Select
              disabled={clientsQuery.isLoading || clients.length === 0}
              onValueChange={handleBusinessSelectChange}
              value={selectedBusiness}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    clients.map((client) => (
                      <SelectItem key={client._id} value={client._id!}>{client.name}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleNewBusinessClick}>
            Crea un nuevo negocio
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSettingsClick} disabled>Configuracion</DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditBusinessClick}>Editar negocio</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 md:gap-8">
        {children}
      </main>
    </div>
  )
}

export default PrivateAdminLayout