"use client";

import { useMemo } from "react";
import { useProducts } from "../_hooks/useProducts";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ProductCard } from "./ProductCard";
import { useClient } from "../_hooks/useClient";
import { Business } from "@/lib/types/Zod/Business";
import BusinessIdContentLoading from "./BusinessIdContentLoading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Products } from "./Tabs/Products";
import { IA } from "./Tabs/IA";

interface Props {
  id: string
}

const BusinessIdContent = (props: Props) => {
  const productsQuery = useProducts(props.id);
  const products = useMemo(() => productsQuery.data || [], [productsQuery.data]);

  const clientQuery = useClient(props.id);
  const client = useMemo(() => clientQuery.data || {}, [clientQuery.data]) as Business;


  if (clientQuery.isLoading || clientQuery.isFetching || productsQuery.isLoading || productsQuery.isFetching) {
    return <BusinessIdContentLoading />
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="relative w-full h-16 md:h-36">
        <Image
          fill
          src={client.heroImage as string}
          alt="Image"
          className="h-full w-full object-cover"
        />
        <Avatar
          className="absolute -bottom-8 left-4 h-20 w-20 rounded-full border-2"
        >
          <AvatarImage
            src={client.heroImage as string}
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        </Avatar>
      </div>
      <h1 className="text-2xl font-bold">
        {client.name}
      </h1>

      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="ia">IA</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Products products={products} />
        </TabsContent>
        <TabsContent value="ia">
          <IA />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BusinessIdContent;