"use client"

import * as React from "react"
import {
  ShoppingCartIcon,
  TrashIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import { useCart } from "@/hooks/useCart"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Label } from "./ui/label"
import Image from "next/image"

const comission = 5;

export function NavActions() {
  const { cart, removeFromCart } = useCart();

  const productsTotal = React.useMemo(() => {
    return Object.keys(cart).reduce((acc, key) => {
      const item = cart[key];
      return acc + item.price * item.quantity;
    }, 0);
  }, [cart]);

  const comisionTotal = React.useMemo(() => {
    return Object.keys(cart).reduce((acc, key) => {
      const item = cart[key];
      return acc + item.price * item.quantity * comission / 100;
    }, 0);
  }, [cart]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <Input placeholder="Busca un restaurante..." className="h-7" />
      <Sheet>
        <SheetTrigger asChild>
          <div className="relative flex items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8 cursor-pointer">
            <ShoppingCartIcon className="h-5 w-5" />
              <div className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 text-xs font-semibold bg-blue-500 rounded-full">
                {Object.keys(cart).length}
              </div>
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Carrito de compras</SheetTitle>
            <SheetDescription>
              Aqui apareceran todos los productos que tienes en tu carrito
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 py-4">
            {Object.keys(cart).map((key) => {
              const item = cart[key];
              return (
                <div key={item._id} className="flex flex-col gap-2 p-4 border-[1px] border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div>
                      <Label>x {item.quantity}</Label>
                    </div>
                    <div className="relative h-10 w-10 rounded-full bg-slate-200">
                      <Image
                        src={item.image as string}
                        alt={item.name}
                        fill
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-slate-400">
                        ${item.price.toFixed(2)} x item
                      </p>
                    </div>
                    <div className="flex items-center ml-auto cursor-pointer" onClick={() => removeFromCart(item._id!)}>
                      <TrashIcon className="h-4 w-4 text-red-500" />
                    </div>
                  </div>
                </div>
              )
            }
          )}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Productos: </p>
                  <p className="text-xs text-slate-400">
                    ${productsTotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Comision (10%): </p>
                  <p className="text-xs text-slate-400">
                    ${comisionTotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Total: </p>
                  <p className="text-xs text-slate-400">
                    ${(productsTotal + comisionTotal).toFixed(2)}
                  </p>
                </div>
                <Button disabled={Object.keys(cart).length === 0}>Pagar</Button>
              </div>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
