"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import BusinessGridLoading from "./BusinessGridLoading";
import { Business } from "@/lib/types/Zod/Business";
import { useBusinesses } from "../_hooks/useBusinesses";

interface Props {
  businesses: Business[];
  businessQuery: ReturnType<typeof useBusinesses>;
}

const BusinessGrid = (props: Props) => {
  const { businesses, businessQuery } = props;
  const router = useRouter();

  const handleBusinessClick = (id: string) => {
    router.push(`/user/businesses/${id}`)
  }

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