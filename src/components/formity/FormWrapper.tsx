import type { OnReturn } from "formity";

import { Formity } from "formity";

import components from "./components";
import schema from "../DeliveryOnboard/schema";

interface FormProps {
  onReturn: OnReturn;
}

export default function Form({ onReturn }: FormProps) {
  return (
    <Formity components={components} schema={schema} onReturn={onReturn} />
  );
}
