import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Business } from "@/lib/types/Zod/Business"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const BusinessCarrousel = ({ businesses, title = "Para ti", loading }: { businesses: Business[], title?: string, loading?: boolean }) => {
  const router = useRouter();

  const handleBusinessClick = (id: string) => {
    router.push(`/user/businesses/${id}`)
  }

  const carrouselContent = useMemo(() => {
    if (loading) {
      return (
        Array(10).fill(0).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div className="flex flex-col gap-4">
              <div className="w-full relative min-h-[185px] animate-pulse rounded-md bg-muted" />
              <div className="min-h-5 w-full animate-pulse rounded-md bg-muted" />
              <div className="min-h-5 w-full animate-pulse rounded-md bg-muted" />
            </div>
          </CarouselItem>
        ))
      )
    }

    if (!businesses.length) {
      return (
        <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
          <div className="flex flex-col gap-4">
            <div className="w-full relative min-h-[185px] flex items-center justify-center">
              No hay negocios disponibles
            </div>
          </div>
        </CarouselItem>
      )
    }

    return (
      businesses.map((business) => (
        <CarouselItem key={business._id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
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
        </CarouselItem>
      ))
    )
  }, [loading, businesses, handleBusinessClick]);

  return (
    <div>
      <h3 className="text-2xl font-bold">
        {title}
      </h3>
      <div className="flex justify-center p-10 items-center">
        <Carousel
          opts={{
            align: "start",
          }}
          className="relative flex-1"
        >
          <CarouselContent>
            {carrouselContent}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

export default BusinessCarrousel