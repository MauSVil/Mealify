'use client';

import { useParams } from "next/navigation";
import { useOrder } from "./_hooks/useOrder";
import { useEffect, useMemo, useRef, useState } from "react";
import { Order } from "@/lib/types/Zod/Order";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";

const translatedStatuses: Record<string, string> = {
  'on-hold': 'En espera',
  'taken': 'Tomada',
  'paid': 'Pagada',
  'canceled': 'Cancelada',
}

const libraries: Library[] = ['core', 'maps']


const UserOrderIdPage = () => {
  const params = useParams();
  const orderId = params.id;

  const [orderState, setOrderState] = useState<Order | null>(null);

  const orderQuery = useOrder(orderId as string);
  const order = useMemo(() => orderQuery.data || {}, [orderQuery.data]) as Order;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    language: 'es',
    libraries,
  })

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        if (mapRef.current) {
          const mapOptions = {
            center: { lat: 19.5101674, lng: -99.2394589 },
            zoom: 15,
            mapId: 'MY-MAP-1234',
          };
          
          new google.maps.Map(mapRef.current, mapOptions);
        }
      }, 300); 
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (order) {
      setOrderState(order);
    }
  }, [order]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex gap-8">
        <div className="flex-1 flex h-full rounded-md" ref={mapRef} />
        <div className="flex-1 flex flex-col gap-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">
                Detalles
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm font-medium">
                    Restaurante
                  </div>
                  <div className="text-sm text-slate-400">
                    {orderState?.restaurant}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm font-medium">
                    Estatus
                  </div>
                  <div className="text-sm text-slate-400 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse" />
                    <div className="text-sm font-medium">
                      {translatedStatuses[orderState?.status as string]}
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <ul className="space-y-4">
                {
                  (orderState?.products || []).map((product) => (
                    <li key={product.id} className="flex gap-4 p-4 border-[1px] border-slate-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <Label>x {product.quantity}</Label>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-slate-400">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">
                Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm font-medium">
                    Fecha
                  </div>
                  <div className="text-sm text-slate-400">
                    {orderState?.createdAt ? new Date(orderState.createdAt).toLocaleDateString() : ''}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">
                    Recibo
                  </div>
                  <Button variant="outline" onClick={() => window.open(orderState?.receiptUrl as string, '_blank')}>
                    Descargar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

export default UserOrderIdPage;