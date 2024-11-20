import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cn } from "@/lib/utils";
import { BeefIcon, ChefHatIcon, FishIcon, IceCreamBowlIcon, SoupIcon } from "lucide-react";

const categories = [
  {
    name: 'Mexican',
    icon: <BeefIcon className="h-8 w-8 bg-background rounded-full" />,
  },
  {
    name: 'Italian',
    icon: <SoupIcon className="h-8 w-8 bg-background rounded-full" />,
  },
  {
    name: 'American',
    icon: <ChefHatIcon className="h-8 w-8 bg-background rounded-full" />,
  },
  {
    name: 'Asian',
    icon: <FishIcon className="h-8 w-8 bg-background rounded-full" />,
  },
  {
    name: 'Other',
    icon: <IceCreamBowlIcon className="h-8 w-8 bg-background rounded-full" />,
  },
]

interface Props {
  categorySelected?: string;
  setCategorySelected?: (category: string) => void;
}

const CategoriesCarrousel = (props: Props) => {
  return (
    <div>
      <h3 className="text-2xl font-bold">
        Categorías
      </h3>
      <div className="flex justify-center p-10 items-center">
        <Carousel
          opts={{
            align: "start",
          }}
          className="relative flex-1"
        >
          <CarouselContent>
            {
              categories.map((category) => (
                <CarouselItem key={category.name} className="basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div
                    key={category.name}
                    className={cn("flex flex-col gap-4 cursor-pointer items-center justify-center border-[1px] border-slate-200 rounded-lg p-4", {
                      "border-primary": category.name === props.categorySelected,
                    })}
                    onClick={() => props.setCategorySelected?.(category.name === props.categorySelected ? '' : category.name)}
                  >
                    {category.icon}
                  </div>
                </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

export default CategoriesCarrousel