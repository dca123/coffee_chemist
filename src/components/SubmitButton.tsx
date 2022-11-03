export const SubmitButton = ({ isLoading }: { isLoading: boolean }) => {
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
