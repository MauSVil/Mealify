import { Slider } from "@/components/ui/slider"
import { useState } from "react";

export const IA = () => {
  const [value, setValue] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">
        Sugiereme platillos con este presupuesto
        <p className="text-base text-muted-foreground">
          {`$${value}`}
        </p>
      </h1>
      <Slider
        step={100}
        max={1000}
        min={0}
        value={[value]}
        onValueChange={([newValue]) => setValue(newValue)}
      />
    </div>
  )
}