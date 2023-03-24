import { type NextPage } from "next";
import type { Control, FieldPath } from "react-hook-form";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../utils/trpc";
import { CreateReviewInput } from "../server/schema/review";
import dayjs from "dayjs";
import { SubmitButton } from "../components/SubmitButton";
import Link from "next/link";
import type { Cafe } from "@prisma/client";
import { Brew } from "@prisma/client";
import { DevTool } from "@hookform/devtools";
import clsx from "clsx";
import { useState } from "react";
import { Listbox, RadioGroup } from "@headlessui/react";
import * as Slider from "@radix-ui/react-slider";
import * as Progress from "@radix-ui/react-progress";

import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Meter } from "../components/Meter";

const Home: NextPage = () => {
  return (
    <div className="mx-auto space-y-4">
      <Meter />
      <PropertyForm label="Aroma" />
      <div className="flex justify-center space-x-3">
        <button className="flex items-center space-x-3 rounded border-2 border-amber-900 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-700">
          <ArrowLeftIcon className="h-4 w-4" />
          <p>Previous</p>
        </button>
        <button className="flex items-center space-x-3 rounded border-2 border-amber-900 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-700">
          <p>Next</p>
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

type PropertyFormProps = {
  label: "Aroma" | "Flavor" | "Acidity" | "Body" | "Sweetness";
};
const PropertyForm = (props: PropertyFormProps) => {
  return (
    <div className="space-y- mt-4">
      <h1 className="text-center font-serif text-lg">{props.label}</h1>
      <form className="space-y-3">
        <RatingInput label="Quality" />
        <RatingInput label="Intensity" />
      </form>
    </div>
  );
};
type RatingInputProps = {
  label: "Quality" | "Intensity";
};
const RatingInput = (props: RatingInputProps) => {
  const [value, setValue] = useState([5]);

  return (
    <div className="mx-auto w-fit space-y-2 rounded border-2 border-yellow-700 p-6">
      <h2 className="text-center font-serif text-xl">{props.label}</h2>
      <h2 className="text-center font-serif text-3xl font-bold">{value}</h2>
      <Slider.Root
        className="relative mx-auto flex h-5 w-[200px] touch-none select-none items-center"
        value={value}
        onValueChange={(values) => setValue(values)}
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

export default Home;
