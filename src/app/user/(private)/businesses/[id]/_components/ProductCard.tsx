import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Product } from "@/lib/types/Zod/Product"
import Image from "next/image"

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="flex relative items-center justify-between w-full gap-4 min-h-36">
      <div className="h-full flex flex-1 flex-col gap-1 border-r-2 p-4">
        <h3 className="text-base font-extrabold">
          {product.name}
        </h3>
        <h5 className="text-sm font-normal">
          ${product.price}.00
        </h5>
        <p className="text-sm text-muted-foreground">
          {product.description}
        </p>
      </div>
      <div className="relative w-1/3 h-full">
        <Image
          src="https://minio.mausvil.dev/businesses/67141c4d4373b7d9b4bb9064.jpeg"
          alt="Image"
          fill
          className="h-full object-cover rounded-r"
        />
        <Button className="absolute bottom-2 right-2 h-8 w-8 rounded-full">
          +
        </Button>
      </div>
    </div>
  )
}