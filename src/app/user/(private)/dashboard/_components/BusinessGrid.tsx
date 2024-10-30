"use client"

import { use, useEffect, useMemo, useState } from "react";
import { useBusinesses } from "../_hooks/useBusinesses";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import BusinessGridLoading from "./BusinessGridLoading";

const BusinessGrid = () => {
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const businessQuery = useBusinesses(latitude, longitude);
  const businesses = useMemo(() => businessQuery.data || [], [businessQuery.data]);

  const router = useRouter();

  const handleBusinessClick = (id: string) => {
    router.push(`/user/businesses/${id}`)
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


  if (businessQuery.isLoading || businessQuery.isFetching || businesses.length === 0) {
    return <BusinessGridLoading />
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {businesses.map((business) => (
        <div
          key={business._id}
          className="flex flex-col gap-4 cursor-pointer"
          onClick={() => handleBusinessClick(business._id as string)}
        >
          <div className="w-full relative min-h-[185px]">
            <Image
              src={business.heroImage as string}
              alt={business.name}
              fill
              style={{ objectFit: 'cover', borderRadius: '10px' }}
            />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {business.name}
            </div>
            <p className="text-xs text-muted-foreground">
              {business.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BusinessGrid