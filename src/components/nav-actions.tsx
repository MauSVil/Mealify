"use client"

import * as React from "react"
import {
  Check,
  ChevronsUpDown,
  Loader2,
  ShoppingCartIcon,
  TrashIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from "@/hooks/useCart"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Label } from "./ui/label"
import Image from "next/image"
import ky from "ky";
import { Separator } from "./ui/separator";
import { useCheckoutSheet } from "@/hooks/useCheckoutSheet";
import { cn } from "@/lib/utils";
import { AddAdressDialog } from "./Modals/AddAdress";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";
import { useAddress } from "@/hooks/useAddress";
import { useAddresses } from "@/hooks/useAddresses";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


export function NavActions() {
  const [open, setOpen] = React.useState(false);
  const [comission, setComission] = React.useState(5);
  const { isOpenCheckoutSheet, openCheckoutSheet, closeCheckoutSheet } = useCheckoutSheet();
  const { cart, removeFromCart } = useCart();

  const addressesQuery = useAddresses();
  const addresses = React.useMemo(() => addressesQuery.data || [], [addressesQuery.data]);

  const { address, setAddressValue} = useAddress();

  const productsTotal = React.useMemo(() => {
    return Object.keys(cart).reduce((acc, key) => {
      const item = cart[key];
      return acc + item.price * item.quantity;
    }, 0);
  }, [cart]);

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    if (!stripe) {
      alert('No se pudo cargar Stripe');
      return;
    }
    
    const checkoutSession = await ky.post('/api/user/orders/create-checkout-session', {
      json: {
        products: cart,
        address,
        deliveryPersonComission: comission,
      }
    }).json() as { data?: string, error?: string };

    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession?.data as string,
    });
    
    if (result.error) {
      alert(result.error.message);
    }
  };

  const handleAddAddress = async () => {
    try {
      const resp =await AddAdressDialog();
      if (resp) {
        await ky.post('/api/user/addresses', { json: resp }).json() as { data: string, error?: string };
        addressesQuery.refetch();
      }
    } catch (e) {
      console.error(e);
    }
  }


  React.useEffect(() => {
    if (addresses.length > 0) {
      setAddressValue(addresses[0]._id);
    }
  }, [addresses])

  return (
    <div className="flex items-center gap-2 text-sm">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-[250px]"
            disabled={addressesQuery.isLoading}
          >
            {addressesQuery.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {address
              ? addresses.find((ad) => ad._id === address)?.name
              : "Selecciona una ubicación"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[250px]">
          <Command>
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {addresses.map((ad) => (
                  <CommandItem
                    key={ad._id}
                    value={ad._id}
                    onSelect={(currentValue) => {
                      setAddressValue(currentValue)
                      setOpen(false)
                    }}
                  >
                    {ad.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        address === ad._id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
                <CommandSeparator />
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    handleAddAddress()
                  }}
                >
                  Agregar nueva ubicación
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Sheet
        open={isOpenCheckoutSheet}
        onOpenChange={(open) => {
          if (!open) {
            closeCheckoutSheet()
            return;
          }
          openCheckoutSheet()
        }}
      >
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
          <div className="flex flex-col items-end gap-3 mb-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Productos: </p>
              <p className="text-xs text-slate-400">
                ${productsTotal.toFixed(2)}
              </p>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <div
                className={cn("border-[1px] border-gray-300 rounded-md flex items-center justify-center p-1 cursor-pointer", {
                  "border-primary": comission === 5,
                })}
                onClick={() => setComission(5)}
              >
                5%
              </div>
              <div
                className={cn("border-[1px] border-gray-300 rounded-md flex items-center justify-center p-1 cursor-pointer", {
                  "border-primary": comission === 10,
                })}
                onClick={() => setComission(10)}
              >
                10%
              </div>
              <div
                className={cn("border-[1px] border-gray-300 rounded-md flex items-center justify-center p-1 cursor-pointer", {
                  "border-primary": comission === 15,
                })}
                onClick={() => setComission(15)}
              >
                15%
              </div>
              <div
                className={cn("border-[1px] border-gray-300 rounded-md flex items-center justify-center p-1 cursor-pointer", {
                  "border-primary": comission === 20,
                })}
                onClick={() => setComission(20)}
              >
                20%
              </div>
            </div>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <div className="flex flex-col items-end gap-2">
                <Button disabled={Object.keys(cart).length === 0} onClick={handleCheckout}>Pagar</Button>
              </div>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
