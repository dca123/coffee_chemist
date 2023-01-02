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

const Home: NextPage = () => {
  const { mutate, isLoading } = trpc.review.create.useMutation();
  const {
    handleSubmit,
    control,
    register,
    setError,
    formState: { errors, touchedFields },
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(CreateReviewInput),
    defaultValues: {
      aroma_quality: 5,
      aroma_intensity: 5,

      acidity_quality: 5,
      acidity_intensity: 5,

      sweetness_quality: 5,
      sweetness_intensity: 5,

      body_quality: 5,
      body_intensity: 5,

      finish_quality: 5,
      finish_intensity: 5,
    },
  });
  const displayDate = dayjs().format("hh:mm a, dddd D, MMM ");
  console.log(errors);
  const submit = handleSubmit((data) => {
    const requiredFields: Array<keyof CreateReviewInput> = [
      "acidity_intensity",
      "acidity_quality",
      "aroma_intensity",
      "aroma_quality",
      "body_intensity",
      "body_quality",
      "finish_intensity",
      "finish_quality",
      "sweetness_intensity",
      "sweetness_quality",
    ];

    const untouchedFields = requiredFields.filter(
      (field) => Object.keys(touchedFields).includes(field) === false
    );

    if (untouchedFields.length > 0) {
      untouchedFields.forEach((field) =>
        setError(field, { type: "required", message: "Required" })
      );
      return;
    }

    mutate(data);
  });
  return (
    <div className="mt-8 flex  flex-col items-center  space-y-8">
      <div>
        <h1 className="text-center text-xl font-light">New Review</h1>
        <h1 className="text-center text-2xl font-medium">{displayDate}</h1>
      </div>
      <form onSubmit={submit} className="flex  flex-col items-center space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <InputDecorator label="Acidity">
            <Input control={control} name="acidity_quality" />
            <Input control={control} name="acidity_intensity" />
          </InputDecorator>
          <InputDecorator label="Aroma">
            <Input control={control} name="aroma_quality" />
            <Input control={control} name="aroma_intensity" />
          </InputDecorator>
          <InputDecorator label="Body">
            <Input control={control} name="body_quality" />
            <Input control={control} name="body_intensity" />
          </InputDecorator>
          <InputDecorator label="Finish">
            <Input control={control} name="finish_quality" />
            <Input control={control} name="finish_intensity" />
          </InputDecorator>
          <InputDecorator label="Sweetness">
            <Input control={control} name="sweetness_quality" />
            <Input control={control} name="sweetness_intensity" />
          </InputDecorator>
          <InputDecorator label="Location">
            <div className="w-full space-y-2">
              <ReviewLocation
                home={
                  <div className="space-y-4">
                    <div className="flex w-full items-center justify-between space-x-4">
                      <p className="min-w-max">Coffee</p>
                      <CoffeeQuery>
                        {(data) => (
                          <CoffeeSelect control={control} data={data} />
                        )}
                      </CoffeeQuery>
                    </div>
                  </div>
                }
                cafe={
                  <div className="space-y-4">
                    <div className="flex w-full items-center justify-between space-x-4">
                      <p className="min-w-max">Cafe</p>
                      <CafeQuery>
                        {(data) => <CafeSelect cafes={data} />}
                      </CafeQuery>
                    </div>
                  </div>
                }
              />
            </div>
          </InputDecorator>
          <InputDecorator label="Brew">
            <BrewSelect control={control} />
          </InputDecorator>
          <InputDecorator label="Notes">
            <textarea
              {...register("notes")}
              placeholder="Anything else to record"
              className="w-full rounded bg-slate-700 p-2 text-slate-200"
            />
          </InputDecorator>
        </div>
        <SubmitButton isLoading={isLoading} />
      </form>
      <DevTool control={control} />
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

const CafeQuery = ({
  children,
}: {
  children: (data: Array<Cafe>) => React.ReactElement;
}) => {
  const { data, isLoading, isError } = trpc.cafe.all.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (data.length === 0) {
    return (
      <div>
        No Cafe -{" "}
        <Link href="/cafe/new" className="underline">
          Create One
        </Link>
      </div>
    );
  }

  return children(data);
};

const CafeSelect = ({ cafes }: { cafes: Cafe[] }) => {
  const [selectedCafe, setSelectedCafe] = useState<Cafe>(cafes[0] as Cafe);

  return (
    <Listbox value={selectedCafe} onChange={setSelectedCafe}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded border border-white py-2 pl-3 pr-10 text-left">
          {selectedCafe.name}
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-600 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {cafes.map((cafe) => (
            <Listbox.Option key={cafe.id} value={cafe}>
              {({ selected, active }) => (
                <li
                  className={clsx(
                    "px-2 py-1",
                    active ? "bg-slate-500" : "bg-slate-600"
                  )}
                >
                  {cafe.name}
                </li>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

const ReviewLocation = ({
  home,
  cafe,
}: {
  home: React.ReactElement;
  cafe: React.ReactElement;
}) => {
  const [location, setLocation] = useState<"home" | "cafe">("home");
  const locationForm = location === "home" ? home : cafe;
  return (
    <div className="w-full space-y-2">
      <RadioGroup
        value={location}
        onChange={setLocation}
        className="flex w-full space-x-4"
      >
        <RadioGroup.Option value="home" className="w-full">
          {({ checked }) => (
            <button
              type="button"
              className={clsx(
                checked ? "bg-sky-700" : "",
                "w-full cursor-pointer rounded border px-2 py-2"
              )}
            >
              Home
            </button>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value="cafe" className="w-full">
          {({ checked }) => (
            <button
              type="button"
              className={clsx(
                checked ? "bg-sky-700" : "",
                "w-full cursor-pointer rounded border px-2 py-2"
              )}
            >
              Cafe
            </button>
          )}
        </RadioGroup.Option>
      </RadioGroup>
      {locationForm}
    </div>
  );
};

const BrewSelect = ({ control }: { control: Control<CreateReviewInput> }) => {
  const { field } = useController({
    control,
    name: "brew",
    defaultValue: Brew.Espresso,
  });

  const displayBrewMap: Record<Brew, string> = {
    Coldbrew: "Cold Brew",
    Espresso: "Espresso",
    Frenchpress: "French Press",
    MokaPot: "Moka Pot",
  };

  const handleChange = (brew: Brew) => {
    field.onBlur();
    field.onChange(brew);
  };

  return (
    <RadioGroup
      className="mt-2 w-full space-y-3"
      value={field.value}
      onChange={handleChange}
    >
      {Object.values(Brew).map((brew) => (
        <RadioGroup.Option key={brew} value={brew}>
          {({ checked }) => (
            <div
              className={clsx(
                checked ? "border-sky-600 bg-sky-600" : "",
                "w-full rounded border p-2 text-center text-lg ring-1"
              )}
            >
              {displayBrewMap[brew]}
            </div>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
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
    name: "coffeeId",
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
  const {
    field,
    fieldState: { isTouched, error },
  } = useController({
    control,
    name,
  });
  const isIntensity = name.endsWith("intensity");
  const label = isIntensity ? "Quality" : "Intensity";
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onBlur();
    return field.onChange(parseInt(e.target.value));
  };

  return (
    <div className="flex flex-col space-y-1">
      <p className="text-white">{label}</p>
      <div className="flex flex-col justify-start">
        <p
          className={clsx(
            "text-xl",
            isTouched ? "text-white" : "text-slate-400"
          )}
        >
          {field.value}
        </p>
        <input
          {...field}
          type={"range"}
          min={1}
          max={10}
          step={1}
          onChange={handleChange}
        />
        <p className="pt-2 text-sm text-red-400">{error?.message}</p>
      </div>
    </div>
  );
};

export default Home;
