"use client";

import { useEffect, useMemo, useState } from "react";
import BusinessGrid from "./_components/BusinessGrid"
import { useOrders } from "./_hooks/useOrders";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useBusinesses } from "./_hooks/useBusinesses";
import { toast } from "sonner";
import _ from "lodash";

export default function Page() {
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);

  const ordersQuery = useOrders();
  const orders = useMemo(() => ordersQuery.data || [], [ordersQuery.data]);

  const businessQuery = useBusinesses(latitude, longitude);
  const businesses = useMemo(() => businessQuery.data || [], [businessQuery.data]);
  const mappedBusinesses = useMemo(() => {
    return _.keyBy(businesses, '_id');
  }, [businessQuery.data]);

  const router = useRouter();

  const handleSeeDetails = () => {
    router.push(`/user/orders/${orders[0]._id}`)
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        },
        (err) => {
          toast.error("Error al buscar restaurantes");
        }
      );
    } else {
      toast.error("Debes habilitar la geolocalización para poder buscar restaurantes");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      businessQuery.refetch();
    }
  }, [latitude, longitude]);

  return (
    <div className="flex flex-col gap-4">
      {
        !ordersQuery.isFetching && !businessQuery.isFetching && orders.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            <div className="border-primary min-h-[60px] p-4 border-[1px] rounded-md">
              <div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-bold">
                      {`Tienes una orden activa de ${mappedBusinesses[orders[0].restaurant].name}`}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {`Creada el 01/01/2023`}
                    </p>
                  </div>
                  <Button variant="outline" size={"sm"} onClick={handleSeeDetails}>
                    Ver detalles
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      }
      <BusinessGrid businesses={businesses} businessQuery={businessQuery} />
    </div>
  )
}
