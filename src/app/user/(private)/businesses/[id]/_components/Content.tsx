"use client";

import { useMemo } from "react";
import { useProducts } from "../_hooks/useProducts";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

interface Props {
  id: string
}

const BusinessIdContent = (props: Props) => {
  const productsQuery = useProducts(props.id);
  const products = useMemo(() => productsQuery.data || [], [productsQuery.data]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:gap-12 md:p-8">
      <div className="relative w-full h-32 md:h-64">
        <Image
          fill
          src="https://minio.mausvil.dev/businesses/67141c4d4373b7d9b4bb9064.jpeg"
          alt="Image"
          className="h-full w-full object-cover"
          style={{ filter: "blur(3px)" }}
        />
        <Avatar
          className="absolute -bottom-8 left-4 h-20 w-20 rounded-full"
        >
          <AvatarImage
            src="https://minio.mausvil.dev/businesses/67141c4d4373b7d9b4bb9064.jpeg"
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        </Avatar>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          {products.length > 0 ? products[0].name : ""}
        </h1>
        <p className="text-sm text-muted-foreground">
          {products.length > 0 ? products[0].description : ""}
        </p>
      </div>
    </div>
  )
}

export default BusinessIdContent;