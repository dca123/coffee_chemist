import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import type { Control, FieldPath } from "react-hook-form";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../utils/trpc";
import { CreateReviewInput } from "../server/schema/review";
import dayjs from "dayjs";

const Home: NextPage = () => {
  // const hello = trpc.review.reviews.useQuery();
  const { mutate, isLoading } = trpc.review.create.useMutation();
  const { handleSubmit, control } = useForm<CreateReviewInput>({
    resolver: zodResolver(CreateReviewInput),
    defaultValues: {
      aroma_quality: 5,
      aroma_quantity: 5,

      acidity_quality: 5,
      acidity_quantity: 5,

      sweetness_quality: 5,
      sweetness_quantity: 5,

      body_quality: 5,
      body_quantity: 5,

      finish_quality: 5,
      finish_quantity: 5,
    },
  });
  const displayDate = dayjs().format("hh:mm a, dddd D, MMM ");

  const submit = handleSubmit((data) => mutate(data));
  return (
    <div className="mt-8 flex  flex-col items-center  space-y-8">
      <div>
        <h1 className="text-center text-xl font-light">New Review</h1>
        <h1 className="text-center text-2xl font-medium">{displayDate}</h1>
      </div>
      <form onSubmit={submit} className="flex  flex-col items-center space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <InputDecorator label="Acidity">
            <Input control={control} name="acidity_quality" />
            <Input control={control} name="acidity_quantity" />
          </InputDecorator>

          <InputDecorator label="Aroma">
            <Input control={control} name="aroma_quality" />
            <Input control={control} name="aroma_quantity" />
          </InputDecorator>

          <InputDecorator label="Body">
            <Input control={control} name="body_quality" />
            <Input control={control} name="body_quantity" />
          </InputDecorator>

          <InputDecorator label="Finish">
            <Input control={control} name="finish_quality" />
            <Input control={control} name="finish_quantity" />
          </InputDecorator>

          <InputDecorator label="Sweetness">
            <Input control={control} name="sweetness_quality" />
            <Input control={control} name="sweetness_quantity" />
          </InputDecorator>
        </div>
        <SubmitButton isLoading={isLoading} />
      </form>
    </div>
  );
};

const SubmitButton = ({ isLoading }: { isLoading: boolean }) => {
  const displayText = isLoading ? "Saving..." : "Save";
  return (
    <button
      type="submit"
      className=" max-w-min rounded  bg-sky-600 p-2 px-4 text-slate-200"
      disabled={isLoading}
    >
      {displayText}
    </button>
  );
};

const InputDecorator = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => {
  return (
    <div className="rounded border-2 p-4">
      <h2 className="text-md text-blue-400">{label}</h2>
      <div className="mt-1 flex space-x-6">{children}</div>
    </div>
  );
};

const Input = ({
  control,
  name,
}: {
  control: Control<CreateReviewInput>;
  name: FieldPath<CreateReviewInput>;
}) => {
  const { field } = useController({
    control,
    name,
  });

  const isQuality = name.endsWith("quality");
  const label = isQuality ? "Quality" : "Quantity";
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return field.onChange(parseInt(e.target.value));
  };

  return (
    <div className="flex flex-col space-y-1">
      <p className="text-lg">{label}</p>
      <div className="flex flex-col justify-start">
        <p className="text-xl">{field.value}</p>
        <input
          {...field}
          type={"range"}
          min={0}
          max={10}
          step={1}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Home;
