import { type NextPage } from "next";
import { useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { motion } from "framer-motion";
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

const steps = [
  "aroma",
  "acidity",
  "sweetness",
  "body",
  "finish",
  "overall",
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

const Home: NextPage = () => {
  const [step, setStep] = useState(0);
  const [incrementing, setIncrementing] = useState(false);
  const incrementStep = () => {
    setStep((prev) => (prev === steps.length - 1 ? prev : prev + 1));
    setIncrementing(true);
  };
  const decrementStep = () => {
    setStep((prev) => (prev === 0 ? 0 : prev - 1));
    setIncrementing(false);
  };
  const stepName = steps[step];
  const mutation = trpc.review.create.useMutation();

  if (stepName === undefined) {
    throw new Error("Undefined Step !");
  }
  const store = useReviewStore();

  return (
    <div className="mx-auto mt-[10%] flex flex-col items-center space-y-4">
      <Meter
        maxValue={steps.length}
        value={step + 1}
        label="Progress"
        showValueLabel={false}
      />
      <Form<{
        quality: [number];
        intensity: [number];
        notes: string;
      }>
        key={stepName}
        onSubmit={(data) => {
          console.log(data);
          store.setReview(stepName, {
            quality: data.quality[0],
            intensity: data.intensity[0],
            notes: data.notes,
          });
          if (stepName === "overall") {
            console.log("done");
            mutation.mutate({
              acidity_intensity: store.acidity.intensity,
              acidity_notes: store.acidity.notes,
              acidity_quality: store.acidity.quality,
              aroma_intensity: store.aroma.intensity,
              aroma_notes: store.aroma.notes,
              aroma_quality: store.aroma.quality,
              body_intensity: store.body.intensity,
              body_notes: store.body.notes,
              body_quality: store.body.quality,
              finish_intensity: store.finish.intensity,
              finish_notes: store.finish.notes,
              finish_quality: store.finish.quality,
              overall_score: 0,
              sweetness_intensity: store.sweetness.intensity,
              sweetness_notes: store.sweetness.notes,
              sweetness_quality: store.sweetness.quality,
              type: "cafe",
              cafeId: "sss",
              brew: "Coldbrew",
            });
          } else {
            incrementStep();
          }
        }}
      >
        {({ submit }) => (
          <>
            {step < steps.length - 1 ? (
              <PropertyForm label={stepName} isIncrementing={incrementing} />
            ) : (
              <OverallForm variants={variants} />
            )}

            <div className="flex justify-center space-x-3">
              {step > 0 ? (
                <button
                  className="flex items-center space-x-3 rounded border-2 border-amber-900 py-1 px-4 focus:outline-none focus:ring-1 focus:ring-yellow-700"
                  onClick={decrementStep}
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <p>Previous</p>
                </button>
              ) : null}
              {step < steps.length - 1 ? (
                <button
                  className="flex items-center space-x-3 rounded border-2 border-amber-900 py-1 px-4 focus:outline-none focus:ring-1 focus:ring-yellow-700"
                  onClick={submit}
                >
                  <p>Next</p>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              ) : (
                <button
                  className="flex items-center space-x-3 rounded border-2 border-amber-900 py-1 px-4 focus:outline-none focus:ring-1 focus:ring-yellow-700"
                  onClick={submit}
                >
                  <p>Submit</p>
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

type PropertyFormProps = {
  label: string;
  isIncrementing: boolean;
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
const PropertyForm = (props: PropertyFormProps) => {
  const capitalizedLabel =
    props.label.charAt(0).toUpperCase() + props.label.slice(1);
  return (
    <div className="mt-4 p-8">
      <form className="space-y-8">
        <motion.h1
          key={props.label}
          className="text-center font-serif text-xl font-semibold"
          variants={variants}
          custom={props.isIncrementing}
          initial={"hidden"}
          animate="visible"
        >
          {capitalizedLabel}
        </motion.h1>

        <RatingInput
          label="Quality"
          key={`${props.label}Quality`}
          name="quality"
        />
        <RatingInput
          label="Intensity"
          key={`${props.label}Intensity`}
          name="intensity"
        />
        <Field name="notes">
          {({ value, setValue }) => (
            <NotesInput
              key={`${props.label}Notes`}
              label="Notes"
              value={value}
              onChange={(val) => setValue(val)}
            />
          )}
        </Field>
      </form>
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
        className="rounded p-2 font-serif text-xl outline-orange-800 "
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

function OverallForm({ variants }) {
  return (
    <div className="mt-4 space-y-4 p-8">
      <motion.h1
        className="text-center font-serif text-xl font-semibold"
        variants={variants} // custom={props.isIncrementing}
        initial={"hidden"}
        animate="visible"
      >
        Overall
      </motion.h1>
      <RatingInput label="Score" name="score" />
      <BrewSelect />
      <ReviewLocationPanel />
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
