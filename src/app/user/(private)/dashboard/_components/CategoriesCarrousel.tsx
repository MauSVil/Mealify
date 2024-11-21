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
      <div className="flex justify-center p-10 items-center">
        <Carousel
          opts={{
            align: "start",
          }}
          className="flex-1"
        >
          <CarouselContent className="flex-nowrap">
            {
              categories.map((category) => (
                <CarouselItem key={category.name} className="basis-full sm:basis-1/4 lg:basis-1/6 xl:basis-1/8">
                  <div
                    key={category.name}
                    className={cn("flex flex-col gap-4 cursor-pointer items-center justify-center rounded-lg p-4", {
                      "text-primary": category.name === props.categorySelected,
                    })}
                    onClick={() => props.setCategorySelected?.(category.name === props.categorySelected ? '' : category.name)}
                  >
                    {category.icon}
                    <p className="text-sm">
                      {category.name}
                    </p>
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