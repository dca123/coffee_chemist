import { type NextPage } from "next";
import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { motion } from "framer-motion";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import type { AriaMeterProps } from "react-aria";
import { useMeter } from "react-aria";

const steps = [
  "Aroma",
  "Acidity",
  "Sweetness",
  "Body",
  "Finish",
  "Overall",
] as const;

const Home: NextPage = () => {
  const [step, setStep] = useState(0);
  const incrementStep = () =>
    setStep((prev) => (prev === steps.length - 1 ? prev : prev + 1));
  const decrementStep = () => setStep((prev) => (prev === 0 ? 0 : prev - 1));
  const stepName = steps[step] ?? "Unknown";

  return (
    <div className="mx-auto mt-[10%] flex flex-col items-center space-y-4">
      <Meter maxValue={steps.length} value={step + 1} />
      <PropertyForm label={stepName} fromLeft={false} />
      <div className="flex justify-center space-x-3">
        <button
          className="flex items-center space-x-3 rounded border-2 border-amber-900 py-1 px-4 focus:outline-none focus:ring-1 focus:ring-yellow-700"
          onClick={decrementStep}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <p>Previous</p>
        </button>
        <button
          className="flex items-center space-x-3 rounded border-2 border-amber-900 py-1 px-4 focus:outline-none focus:ring-1 focus:ring-yellow-700"
          onClick={incrementStep}
        >
          <p>Next</p>
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

type PropertyFormProps = {
  label: string;
  fromLeft: boolean;
};
const variants = {
  hidden: (fromLeft: boolean) => ({
    x: fromLeft ? -10 : 10,
    opacity: 0,
  }),
  visible: {
    x: 0,
    opacity: 1,
  },
};
const PropertyForm = (props: PropertyFormProps) => {
  return (
    <div className="mt-4 space-y-2 p-8">
      <motion.h1
        key={props.label}
        className="text-center font-serif text-xl font-semibold"
        variants={variants}
        custom={props.fromLeft}
        initial={"hidden"}
        animate="visible"
      >
        {props.label}
      </motion.h1>
      <form className="space-y-3">
        <RatingInput label="Quality" key={`${props.label}Quality`} />
        <RatingInput label="Intensity" key={`${props.label}Intensity`} />
      </form>
    </div>
  );
};
type RatingInputProps = {
  label: "Quality" | "Intensity";
};
const RatingInput = (props: RatingInputProps) => {
  const [value, setValue] = useState([5]);
  const [isIncreasing, setIsIncreasing] = useState(false);

  return (
    <div className="mx-auto w-fit space-y-2 rounded border-2 border-yellow-700 p-6">
      <h2 className="text-center font-serif text-xl">{props.label}</h2>
      <motion.div
        initial={{ opacity: 0, y: isIncreasing ? -10 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: isIncreasing ? 10 : -10 }}
        key={value[0]}
      >
        <h2 className="text-center font-serif text-3xl font-bold">{value}</h2>
      </motion.div>
      <Slider.Root
        className="relative mx-auto flex h-5 w-[200px] touch-none select-none items-center"
        value={value}
        onValueChange={(values) => {
          setValue((prev) => {
            if (prev[0]! < values[0]!) {
              setIsIncreasing(true);
            } else {
              setIsIncreasing(false);
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
  console.log({
    value,
    minValue,
    maxValue,
    barWidth,
  });
  return (
    <div {...meterProps} style={{ width: 200 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {label && <span {...labelProps}>{label}</span>}
        {showValueLabel && <span>{meterProps["aria-valuetext"]}</span>}
      </div>
      <div className="h-2 rounded-full bg-yellow-100">
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
