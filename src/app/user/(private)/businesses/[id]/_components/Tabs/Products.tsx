import { Product } from "@/lib/types/Zod/Product"
import { ProductCard } from "../ProductCard"

export const Products = ({ products }: { products: Product[] }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {
        products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      }
    </div>
  )
}