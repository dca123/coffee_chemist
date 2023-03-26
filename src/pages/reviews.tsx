import type { NextPage } from "next";
import type { RouterTypes } from "../utils/trpc";
import { trpc } from "../utils/trpc";
import dayjs from "dayjs";

const Reviews: NextPage = () => {
  const { isLoading, isError, data } = trpc.review.reviews.useQuery();
  // const isLoading = true;
  if (isLoading) {
    return (
      <Layout>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded border p-2">
            <LoadingTable key={i} />
          </div>
        ))}
      </Layout>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Layout>
      {data.map((review) => (
        <div key={review.id} className="rounded border p-2">
          <Table review={review} />
        </div>
      ))}
    </Layout>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-8 mt-2">
      <h1 className="text-center text-xl font-light">Reviews</h1>

      <div className="mt-8 grid grid-cols-1 gap-4">{children}</div>
    </div>
  );
};

const LoadingTable = () => {
  return (
    <table className="text-small w-full text-left ">
      <thead>
        <tr>
          <th>
            <div className="h-2 w-full animate-pulse rounded bg-slate-300" />
          </th>
          <th className="py-3 text-right font-normal">
            <div className="h-2 animate-pulse rounded bg-slate-300" />
          </th>
          <th className="pr-2 text-right font-normal">
            <div className="h-2 animate-pulse rounded bg-slate-300" />
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, i) => (
          <tr className="" key={i}>
            <td className="py-2">
              <div className="h-2 animate-pulse  rounded bg-slate-300 " />
            </td>
            <td className="py-2">
              <div className=" h-2 animate-pulse rounded bg-slate-300" />
            </td>
            <td className="py-2 pr-2">
              <div className=" h-2 animate-pulse rounded bg-slate-300" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Table = ({
  review,
}: {
  review: RouterTypes["review"]["reviews"]["output"][number];
}) => {
  return (
    <table className="text-small w-full text-left ">
      <thead>
        <tr>
          <th className="text-sm font-light">
            <h1>
              <span>{dayjs(review.createdAt).format("dddd D, MMM ")}</span>
              <span>{dayjs(review.createdAt).format("hh:mm a")}</span>
            </h1>
            <h1>
              {review.cafeReview?.cafe.name} - {review.brew}
            </h1>
          </th>
          <th className="py-3 text-right font-normal">Quality</th>
          <th className="text-right font-normal">Intensity</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-red border-b">
          <td className="py-1">Acidity</td>
          <td className="py-1 pr-2 text-right">{review.acidity_quality}</td>
          <td className="py-1 pr-2 text-right">{review.acidity_intensity}</td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Aroma</td>
          <td className="py-1 pr-2 text-right">{review.aroma_quality}</td>
          <td className="py-1 pr-2 text-right">{review.aroma_intensity}</td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Sweetness</td>
          <td className="py-1 pr-2 text-right">{review.sweetness_quality}</td>
          <td className="py-1 pr-2 text-right">{review.sweetness_intensity}</td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Body</td>
          <td className="py-1 pr-2 text-right">{review.body_quality}</td>
          <td className="py-1 pr-2 text-right">{review.body_intensity}</td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Finish</td>
          <td className="py-1 pr-2 text-right">{review.finish_quality}</td>
          <td className="py-1 pr-2 text-right">{review.finish_intensity}</td>
        </tr>
        <tr className="bg-red">
          <td className="py-2 text-sm font-light">{review.flavour_notes}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Reviews;
