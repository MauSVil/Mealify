"use client";

import { useMemo } from "react";
import { useProducts } from "../_hooks/useProducts";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ProductCard } from "./ProductCard";

interface Props {
  id: string
}

const BusinessIdContent = (props: Props) => {
  const productsQuery = useProducts(props.id);
  const products = useMemo(() => productsQuery.data || [], [productsQuery.data]);

  return (
    <div className="flex flex-col gap-12">
      <div className="relative w-full h-16 md:h-36">
        <Image
          fill
          src="https://minio.mausvil.dev/businesses/67141c4d4373b7d9b4bb9064.jpeg"
          alt="Image"
          className="h-full w-full object-cover"
        />
        <Avatar
          className="absolute -bottom-8 left-4 h-20 w-20 rounded-full border-2"
        >
          <AvatarImage
            src="https://minio.mausvil.dev/businesses/67141c4d4373b7d9b4bb9064.jpeg"
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        </Avatar>
      </div>
      <h1 className="text-2xl font-bold">
        Chikabal
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        }
      </div>
    </div>
  )
}

export default BusinessIdContent;