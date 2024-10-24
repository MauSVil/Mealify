"use client"

import * as React from "react"
import {
  ShoppingCartIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import { useCart } from "@/hooks/useCart"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Label } from "./ui/label"
import Image from "next/image"

export function NavActions() {
  const { cart } = useCart();

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
                  </div>
                </div>
              )
            }
          )}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button>Pagar</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
