import type {
  Components,
  Step,
  DefaultValues,
  Resolver,
  OnNext,
  OnBack,
} from "formity";
import type { Value } from "expry";

import { Fragment } from "react";
import Screen from "./screen";
import Form from "./form";
import FormLayout from "./form-layout";
import Next from "./navigation/next";
import Back from "./navigation/back";
import Row from "./user-interface/row";
import TextField from "./react-hook-form/text-field";
import NumberField from "./react-hook-form/number-field";
import Listbox from "./react-hook-form/listbox";
import YesNo from "./react-hook-form/yes-no";
import Select from "./react-hook-form/select";
import MultiSelect from "./react-hook-form/multi-select";


type Parameters = {
  screen: {
    progress: { total: number; current: number };
    children: Value;
  };
  form: {
    step: Step;
    defaultValues: DefaultValues;
    resolver: Resolver;
    onNext: OnNext;
    children: Value;
  };
  formLayout: {
    heading: string;
    description: string;
    fields: Value[];
    button: Value;
    back?: Value;
  };
  next: {
    text: string;
  };
  back: {
    onBack: OnBack;
  };
  row: {
    columns: number;
    items: Value[];
  };
  textField: {
    name: string;
    label: string;
  };
  numberField: {
    name: string;
    label: string;
  };
  listbox: {
    name: string;
    label: string;
    options: { value: string; label: string }[];
  };
  yesNo: {
    name: string;
    label: string;
  };
  select: {
    name: string;
    label: string;
    options: { value: string; label: string }[];
    direction: "x" | "y";
  };
  multiSelect: {
    name: string;
    label: string;
    options: { value: string; label: string }[];
    direction: "x" | "y";
  };
};

const components: Components<Parameters> = {
  screen: ({ progress, children }, render) => (
    <Screen progress={progress}>{render(children)}</Screen>
  ),
  form: ({ step, defaultValues, resolver, onNext, children }, render) => (
    <Form
      step={step}
      defaultValues={defaultValues}
      resolver={resolver}
      onNext={onNext}
    >
      {render(children)}
    </Form>
  ),
  formLayout: ({ heading, description, fields, button, back }, render) => (
    <FormLayout
      heading={heading}
      description={description}
      fields={fields.map((field, index) => (
        <Fragment key={index}>{render(field)}</Fragment>
      ))}
      button={render(button)}
      back={back ? render(back) : undefined}
    />
  ),
  next: ({ text }) => <Next>{text}</Next>,
  back: ({ onBack }) => <Back onBack={onBack} />,
  row: ({ items, columns }, render) => (
    <Row
      columns={columns}
      items={items.map((item, index) => (
        <Fragment key={index}>{render(item)}</Fragment>
      ))}
    />
  ),
  textField: ({ name, label }) => <TextField name={name} label={label} />,
  numberField: ({ name, label }) => <NumberField name={name} label={label} />,
  listbox: ({ name, label, options }) => (
    <Listbox name={name} label={label} options={options} />
  ),
  yesNo: ({ name, label }) => <YesNo name={name} label={label} />,
  select: ({ name, label, options, direction }) => (
    <Select name={name} label={label} options={options} direction={direction} />
  ),
  multiSelect: ({ name, label, options, direction }) => (
    <MultiSelect
      name={name}
      label={label}
      options={options}
      direction={direction}
    />
  ),
};

export default components;
