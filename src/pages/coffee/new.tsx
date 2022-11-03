import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../../components/SubmitButton";
import { CreateCoffeeInput } from "../../server/schema/coffee";
import { trpc } from "../../utils/trpc";

const CreateCoffee: NextPage = () => {
  const { mutate, isLoading } = trpc.coffee.create.useMutation();
  const { register, handleSubmit } = useForm<CreateCoffeeInput>({
    defaultValues: {
      name: "",
      roast: "",
    },
  });
  const submit = handleSubmit((data) => mutate(data));

  return (
    <div>
      <h1 className="text-center text-xl font-light">New Coffee</h1>
      <form
        onSubmit={submit}
        className="mt-4 flex flex-col items-center space-y-6"
      >
        <label className="max-w-min rounded border p-4 text-sky-400">
          Name
          <input
            type="text"
            {...register("name")}
            className="mt-1 rounded bg-slate-100 pl-2 text-slate-800"
          />
        </label>
        <label className="max-w-min rounded border p-4 text-sky-400">
          Roast
          <input
            type="text"
            {...register("roast")}
            className="mt-1 rounded bg-slate-100 pl-2 text-slate-800"
          />
        </label>

        <SubmitButton isLoading={isLoading} />
      </form>
    </div>
  );
};

export default CreateCoffee;
