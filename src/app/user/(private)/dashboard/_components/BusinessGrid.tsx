"use client"

import { useMemo } from "react";
import { useBusinesses } from "../_hooks/useBusinesses";
import Image from "next/image";

const BusinessGrid = () => {
  const businessQuery = useBusinesses();
  const businesses = useMemo(() => businessQuery.data || [], [businessQuery.data]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {businesses.map((business) => (
        <div key={business._id} className="flex flex-col gap-4">
          <div className="w-full relative min-h-[185px]">
            <Image
              src="https://minio.mausvil.dev/businesses/restaurant-front-1.jpg"
              alt={business.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {business.name}
            </div>
            <p className="text-xs text-muted-foreground">
              {business.address}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BusinessGrid