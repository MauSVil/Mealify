"use client"

import { useMemo } from "react";
import { useBusinesses } from "../_hooks/useBusinesses";

const BusinessGrid = () => {
  const businessQuery = useBusinesses();
  const businesses = useMemo(() => businessQuery.data || [], [businessQuery.data]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {businesses.map((business) => (
        <div key={business._id} className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <div className="h-4 w-4 rounded-full bg-white" />
            </div>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {business.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {business.address}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BusinessGrid