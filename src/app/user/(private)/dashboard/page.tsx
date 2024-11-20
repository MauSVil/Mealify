"use client";

import { useMemo, useState } from "react";
import { useBusinesses } from "./_hooks/useBusinesses";
import _ from "lodash";
import BusinessCarrousel from "./_components/BusinessCarrousel";
import CategoriesCarrousel from "./_components/CategoriesCarrousel";
import { useAddress } from "@/hooks/useAddress";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const { address } = useAddress();

  const businessQuery = useBusinesses({ address, selectedCategory});
  const businesses = useMemo(() => businessQuery.data || [], [businessQuery.data]);

  return (
    <div className="relative">
      <div className="flex flex-col gap-4">
        <CategoriesCarrousel categorySelected={selectedCategory} setCategorySelected={setSelectedCategory} />
        <BusinessCarrousel businesses={businesses} loading={businessQuery.isLoading} />
        <BusinessCarrousel businesses={businesses} loading={businessQuery.isLoading} title="Recomendados" />
      </div>
    </div>
  )
}
