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
import { useSocket } from "../../_hooks/useSocket";

const translatedStatuses: Record<string, string> = {
  'on-hold': 'En espera',
  'taken': 'Tomada',
  'paid': 'Pagada',
  'canceled': 'Cancelada',
}

const statusesDescriptions: Record<string, string> = {
  'on-hold': 'Estamos buscando un repartidor para tu pedido...',
  'taken': 'El restaurante esta tomando tu pedido...',
  'paid': 'Tu pedido ha sido pagado...',
  'canceled': 'Tu pedido ha sido cancelado...',
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

  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      const handleOrderUpdate = async (order: any) => {
        console.log(order, "order");
      };

      socket.on("order-update", handleOrderUpdate);

      return () => {
        socket.off("order-update", handleOrderUpdate);
      };
    }
  }, [socket]);

  return (
    <div className="flex flex-1 flex-col gap-4 relative">
      <div className="flex-1 w-full h-full rounded-md hidden md:block" ref={mapRef} />
      <div className="flex-1 flex flex-col gap-4 relative w-full md:absolute md:top-10 md:right-10 md:w-1/3">
        <Card>
          <CardContent className="flex flex-col gap-4 p-4 px-6">
            <h3 className="text-2xl font-bold">
              {statusesDescriptions[orderState?.status as string]}
            </h3>
          </CardContent>
        </Card>
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
  )
}

export default UserOrderIdPage;