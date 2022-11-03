import { type NextPage } from "next";
import type { Control, FieldPath } from "react-hook-form";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../utils/trpc";
import { CreateReviewInput } from "../server/schema/review";
import dayjs from "dayjs";
import { SubmitButton } from "../components/SubmitButton";
import Link from "next/link";

const Home: NextPage = () => {
  const { mutate, isLoading } = trpc.review.create.useMutation();
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<CreateReviewInput>({
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
  console.log(errors);
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
          <InputDecorator label="Meta">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <p className="min-w-max">Coffee</p>
                <CoffeeQuery>
                  {(data) => <CoffeeSelect control={control} data={data} />}
                </CoffeeQuery>
              </div>
              <div className="flex items-center space-x-4">
                <p className="min-w-max">Notes</p>
                <input
                  {...register("notes")}
                  type={"textArea"}
                  className="rounded border bg-slate-800 p-2"
                />
              </div>
            </div>
          </InputDecorator>
        </div>
        <SubmitButton isLoading={isLoading} />
      </form>
    </div>
  );
};

const CoffeeQuery = ({
  children,
}: {
  children: (
    data: { id: string; name: string; roast: string }[]
  ) => React.ReactElement;
}) => {
  const { data, isLoading, isError } = trpc.coffee.all.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (data.length === 0) {
    return (
      <div>
        No Coffee -{" "}
        <Link href="/coffee/new" className="underline">
          Create One
        </Link>
      </div>
    );
  }

  return children(data);
};

const CoffeeSelect = ({
  control,
  data,
}: {
  control: Control<CreateReviewInput>;
  data: { id: string; name: string; roast: string }[];
}) => {
  const { field } = useController({
    control,
    name: "coffee_id",
    defaultValue: data[0]?.id,
  });

  return (
    <select {...field} className="rounded border bg-slate-800 p-2">
      {data.map((coffee) => (
        <option key={coffee.id} value={coffee.id}>
          {coffee.name} - {coffee.roast}
        </option>
      ))}
    </select>
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
      <h2 className="text-md text-sky-400">{label}</h2>
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
