"use client";

import { useMemo, useState } from "react";
import { useBusinesses } from "./_hooks/useBusinesses";
import _ from "lodash";
import BusinessCarrousel from "./_components/BusinessCarrousel";
import CategoriesCarrousel from "./_components/CategoriesCarrousel";
import { useAddress } from "@/hooks/useAddress";
import { Business } from "@/lib/types/Zod/Business";

const translatedCategories: Record<string, string> = {
  'nearbyRestaurants': 'Para ti',
  'nearbyRecommendedRestaurants': 'Recomendados',
  'Mexican': 'Mexicano',
  'Italian': 'Italiano',
  'American': 'Americano',
  'Asian': 'Asia',
  'Other': 'Otro',
}

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const { address } = useAddress();

  const businessQuery = useBusinesses({ address, selectedCategory});
  const businesses = useMemo(() => businessQuery.data || {}, [businessQuery.data]) as Record<string, Business[]>;

  return (
    <div className="relative">
      <div className="flex flex-col gap-4">
        <CategoriesCarrousel categorySelected={selectedCategory} setCategorySelected={setSelectedCategory} />
        {
          Object.keys(businesses).map((key) => {
            return (
              <BusinessCarrousel
                key={key}
                businesses={businesses[key] || []}
                loading={businessQuery.isFetching || businessQuery.isRefetching}
                title={translatedCategories[key]}
              />
            )
          })
        }
      </div>
    </div>
  )
}
