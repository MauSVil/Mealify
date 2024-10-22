"use client";

import { useMemo } from "react";
import { useProducts } from "../_hooks/useProducts";

interface Props {
  id: string
}

const BusinessIdContent = (props: Props) => {
  const productsQuery = useProducts(props.id);
  const products = useMemo(() => productsQuery.data || [], [productsQuery.data]);

  console.log(products, 'products');

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <h1>{props.id}</h1>
    </div>
  )
}

export default BusinessIdContent;