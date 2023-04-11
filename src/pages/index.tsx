/* eslint-disable @typescript-eslint/no-empty-function */
import { type NextPage } from "next";
import { useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  PaperAirplaneIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import type { AriaMeterProps, AriaTextFieldProps } from "react-aria";
import { useMeter, useTextField } from "react-aria";
import { Form, Field } from "houseform";
import { create } from "zustand";
import { trpc } from "../utils/trpc";
import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Brew } from "@prisma/client";
const steps = [
  "aroma",
  "acidity",
  "sweetness",
  "body",
  "finish",
  "overall",
  "brew",
  "location",
] as const;

type Review = {
  quality: number;
  intensity: number;
  notes: string;
};
interface ReviewState {
  aroma: Review;
  acidity: Review;
  sweetness: Review;
  body: Review;
  finish: Review;
  overall: Review;
  setReview: (
    key: "aroma" | "acidity" | "sweetness" | "body" | "finish" | "overall",
    review: Review
  ) => void;
}

const useReviewStore = create<ReviewState>((set) => {
  const defaultReview: Review = {
    quality: 0,
    intensity: 0,
    notes: "",
  };
  const setReview: ReviewState["setReview"] = (key, review) =>
    set(() => ({
      [key]: review,
    }));

  return {
    acidity: defaultReview,
    aroma: defaultReview,
    body: defaultReview,
    finish: defaultReview,
    overall: defaultReview,
    sweetness: defaultReview,
    setReview,
  };
});

interface StepState {
  step: number;
  isIncrementing: boolean;
  incrementStep: () => void;
  decrementStep: () => void;
}
const useStepStore = create<StepState>((set) => ({
  step: 6,
  isIncrementing: true,
  incrementStep: () =>
    set((state) => ({
      step: state.step === steps.length - 1 ? state.step : state.step + 1,
    })),
  decrementStep: () =>
    set((state) => ({
      step: state.step === 0 ? 0 : state.step - 1,
    })),
}));

const Home: NextPage = () => {
  const step = useStepStore((store) => store.step);

  return (
    <div className="mx-auto mt-[10%] flex h-full flex-col items-center space-y-4">
      <Meter
        maxValue={steps.length}
        value={step + 1}
        label="Progress"
        showValueLabel={false}
      />
      <FormWrapper />
    </div>
  );
};
const FormWrapper = () => {
  const step = useStepStore((store) => store.step);
  const stepName = steps[step];
  switch (stepName) {
    case "aroma":
    case "acidity":
    case "sweetness":
    case "body":
    case "finish":
      return <PropertyForm />;
    case "overall":
      return <OverallForm />;
    case "brew":
      return <BrewForm />;
    case "location":
      return <LocationForm />;
    default:
      return null;
  }
};

const BrewForm = () => {
  const [reviewType, setReviewType] = useState<Brew>("Coldbrew");
  const { step, isIncrementing } = useStepStore((store) => ({
    step: store.step,
    isIncrementing: store.isIncrementing,
  }));
  const label = steps[step] as string;
  const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
  const variant = {
    initial: {
      opacity: 0.5,
    },
    animate: {
      opacity: 1,
    },
  };
  return (
    <div className="mt-4 space-y-5 p-8">
      <motion.h1
        key={label}
        className="text-center font-serif text-xl font-semibold"
        variants={variants}
        custom={isIncrementing}
        initial={"hidden"}
        animate="visible"
      >
        {capitalizedLabel}
      </motion.h1>
      <div>
        <RadioGroup.Root
          className="flex w-full flex-col gap-2"
          value={reviewType}
          onValueChange={(val) => setReviewType(val as Brew)}
        >
          {Object.entries(Brew).map(([key, value]) => (
            <div key={key} className="relative">
              <RadioGroup.Item
                value={value}
                className="flex w-full select-none justify-center px-2  py-1 font-serif text-2xl"
              >
                <label>{value}</label>
              </RadioGroup.Item>
              {reviewType === value ? (
                <motion.div
                  className="absolute bottom-0 h-full w-full rounded border border-amber-700"
                  layoutId="border"
                />
              ) : null}
            </div>
          ))}
        </RadioGroup.Root>
      </div>
      <ButtonBar onIncrement={() => {}} onDecrement={() => {}} />
    </div>
  );
};

const LocationForm = () => {
  return <>Brew Form</>;
};

const variants = {
  hidden: (isIncrementing: boolean) => ({
    x: isIncrementing ? -10 : 10,
    opacity: 0,
  }),
  visible: {
    x: 0,
    opacity: 1,
  },
};
const PropertyForm = () => {
  const { step, isIncrementing } = useStepStore((store) => ({
    step: store.step,
    isIncrementing: store.isIncrementing,
  }));
  const label = steps[step] as string;

  const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
  return (
    <div className="mt-4 space-y-5 p-8">
      <form className="space-y-8">
        <motion.h1
          key={label}
          className="text-center font-serif text-xl font-semibold"
          variants={variants}
          custom={isIncrementing}
          initial={"hidden"}
          animate="visible"
        >
          {capitalizedLabel}
        </motion.h1>

        <RatingInput label="Quality" key={`${label}Quality`} name="quality" />
        <RatingInput
          label="Intensity"
          key={`${label}Intensity`}
          name="intensity"
        />
        <Field name="notes">
          {({ value, setValue }) => (
            <NotesInput
              key={`${label}Notes`}
              label="Notes"
              value={value}
              onChange={(val) => setValue(val)}
            />
          )}
        </Field>
      </form>
      <ButtonBar onDecrement={() => {}} onIncrement={() => {}} />
    </div>
  );
};
const NotesInput = (props: AriaTextFieldProps) => {
  const ref = useRef(null);
  const { labelProps, inputProps, descriptionProps, errorMessageProps } =
    useTextField(
      {
        ...props,
        inputElementType: "textarea",
      },
      ref
    );

  return (
    <div className="flex flex-col space-y-2">
      <label {...labelProps} className="text-center font-serif text-xl">
        {props.label}
      </label>

      <textarea
        {...inputProps}
        ref={ref}
        className="rounded bg-amber-50 p-2 font-serif text-xl outline-orange-800"
        rows={2}
      />

      {props.description && (
        <div {...descriptionProps} style={{ fontSize: 12 }}>
          {props.description}
        </div>
      )}
      {props.errorMessage && (
        <div {...errorMessageProps} style={{ color: "red", fontSize: 12 }}>
          {props.errorMessage}
        </div>
      )}
    </div>
  );
};

type RatingInputProps = {
  label: "Quality" | "Intensity" | "Score";
  name: string;
};
const RatingInput = (props: RatingInputProps) => {
  const [isIncreasing, setIsIncreasing] = useState(false);

  return (
    <Field name={props.name} initialValue={[5] as [number]}>
      {({ value, setValue }) => (
        <div className="mx-auto w-fit space-y-2 ">
          <h2 className="text-center font-serif text-xl">{props.label}</h2>
          <motion.h2
            className="text-center font-serif text-3xl font-bold"
            initial={{ opacity: 0, y: isIncreasing ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isIncreasing ? 10 : -10 }}
            key={value[0]}
          >
            {value}
          </motion.h2>

          <Slider.Root
            className="relative mx-auto flex h-5 w-[200px] touch-none select-none items-center"
            value={value}
            onValueChange={(values: [number]) => {
              setValue((prev) => {
                if (prev[0] < values[0]) {
                  setIsIncreasing(false);
                } else {
                  setIsIncreasing(true);
                }
                return values;
              });
            }}
            max={10}
            step={1}
            aria-label="Volume"
          >
            <Slider.Track className="relative h-[3px] grow rounded-full bg-amber-50">
              <Slider.Range className="absolute h-full rounded-full bg-amber-800" />
            </Slider.Track>
            <Slider.Thumb className="hover:bg-violet3 block h-5 w-5 rounded-[10px] bg-white shadow-[0_2px_10px] shadow-amber-900 focus:shadow-[0_0_0_5px] focus:shadow-amber-900 focus:outline-none" />
          </Slider.Root>
        </div>
      )}
    </Field>
  );
};

export const Meter = (props: AriaMeterProps) => {
  const {
    label,
    showValueLabel = !!label,
    value = 50,
    minValue = 0,
    maxValue = 100,
  } = props;
  const { meterProps, labelProps } = useMeter(props);

  // Calculate the width of the progress bar as a percentage
  const percentage = (value - minValue) / (maxValue - minValue);
  const barWidth = `${Math.round(percentage * 100)}%`;
  return (
    <div {...meterProps} style={{ width: 200 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {showValueLabel && <span>{meterProps["aria-valuetext"]}</span>}
      </div>
      <div className="h-2 rounded-full bg-yellow-100" {...labelProps}>
        <motion.div
          className={clsx("h-2 rounded-full bg-amber-800")}
          style={{ width: barWidth }}
          animate={{ width: barWidth }}
        />
      </div>
    </div>
  );
};

export default Home;

function ReviewLocationPanel() {
  const [tab, setTab] = useState<"cafe" | "home">("cafe");
  return (
    <Tabs.Root
      className="flex flex-col rounded border border-amber-700 p-4"
      value={tab}
      onValueChange={(val) => setTab(val as "cafe" | "home")}
    >
      <Tabs.List className="flex">
        <Tabs.Trigger value="cafe" className="px-4 font-serif">
          Cafe{" "}
          {tab === "cafe" ? (
            <motion.div
              layoutId="underline"
              className="border-b border-amber-700"
            />
          ) : null}
        </Tabs.Trigger>
        <Tabs.Trigger value="home" className=" px-4 font-serif">
          Home{" "}
          {tab === "home" ? (
            <motion.div
              layoutId="underline"
              className="border-b border-amber-700"
            />
          ) : null}
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="cafe">
        <motion.div
          animate={{
            opacity: 1,
          }}
          initial={{
            opacity: 0,
          }}
        >
          Cafe Content
        </motion.div>
      </Tabs.Content>
      <Tabs.Content value="home">
        <motion.div
          animate={{
            opacity: 1,
          }}
          initial={{
            opacity: 0,
          }}
        >
          Home Content
        </motion.div>
      </Tabs.Content>
    </Tabs.Root>
  );
}

function BrewSelect({}) {
  return (
    <Select.Root>
      <Select.Trigger
        aria-label="brew"
        className="inline-flex h-10 items-center justify-center gap-2 rounded bg-white px-4 font-serif text-lg leading-none"
      >
        <Select.Value placeholder="Select a brew" />
        <Select.Icon>
          <ChevronDownIcon className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <motion.div
          animate={{
            opacity: 1,
            scale: 1,
          }}
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
        >
          <Select.Content className="rounded-md bg-white font-serif text-lg">
            <Select.Viewport className="p-4">
              <SelectItem label="Cold Brew" value="cold_brew" />
              <SelectItem label="Espresso" value="espresso" />
              <SelectItem label="Moka Pot" value="moka_pot" />
            </Select.Viewport>
          </Select.Content>
        </motion.div>
      </Select.Portal>
    </Select.Root>
  );
}

function OverallForm() {
  const { isIncrementing } = useStepStore((store) => ({
    isIncrementing: store.isIncrementing,
  }));
  return (
    <div className="mt-4 space-y-4 p-8">
      <motion.h1
        className="text-center font-serif text-xl font-semibold"
        variants={variants}
        custom={isIncrementing}
        initial={"hidden"}
        animate="visible"
      >
        Overall
      </motion.h1>
      <RatingInput label="Score" name="score" />
      <NotesInput label="Notes" />
      <ButtonBar onDecrement={() => {}} onIncrement={() => {}} />
      {/* <BrewSelect /> */}
    </div>
  );
}
type SelectItemProps = {
  value: string;
  label: string;
};
function SelectItem(props: SelectItemProps) {
  return (
    <Select.Item
      value={props.value}
      className="relative flex h-8 select-none items-center rounded pl-7 leading-none data-[highlighted]:bg-amber-300"
    >
      <Select.ItemText>{props.label}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-1 inline-flex w-4 items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
}

type ButtonBarProps = {
  onDecrement: () => void;
  onIncrement: () => void;
};
function ButtonBar(props: ButtonBarProps) {
  const { incrementStep, decrementStep } = useStepStore((state) => ({
    incrementStep: state.incrementStep,
    decrementStep: state.decrementStep,
  }));

  const handleIncrement = () => {
    props.onIncrement();
    incrementStep();
  };

  const handleDecrement = () => {
    props.onDecrement();
    decrementStep();
  };

  return (
    <div className="flex justify-center space-x-3">
      <button
        className="flex items-center space-x-3 rounded border-2 border-amber-200 py-1 px-4 focus:outline-none focus:ring-1 focus:ring-yellow-700"
        onClick={handleDecrement}
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <p className="font-serif text-lg">Previous</p>
      </button>

      <button
        className="flex items-center space-x-3 rounded border-2 border-amber-200 py-1 px-4 focus:outline-none focus:ring-1 focus:ring-yellow-700"
        onClick={handleIncrement}
      >
        <p className="font-serif text-lg">Next</p>
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
