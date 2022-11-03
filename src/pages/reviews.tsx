import { Review } from "@prisma/client";
import { NextPage } from "next";
import { trpc } from "../utils/trpc";
import dayjs from "dayjs";

const Reviews: NextPage = () => {
  const { isLoading, isError, data } = trpc.review.reviews.useQuery();
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
    <div className="mx-16 mt-2">
      <h1 className="text-center text-xl font-light">Reviews</h1>

      <div className="mt-8 grid grid-cols-4 gap-4">{children}</div>
    </div>
  );
};

const LoadingTable = () => {
  return (
    <table className="text-small w-full text-left ">
      <thead>
        <tr>
          <th>
            <div className="h-2 w-full animate-pulse rounded bg-slate-200" />
          </th>
          <th className="py-3 text-right font-normal">Quality</th>
          <th className="text-right font-normal">Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-red  border-b">
          <td className="py-1">Acidity</td>
          <td className="py-1">
            <div className="float-right h-2 w-1/2 animate-pulse rounded bg-slate-200" />
          </td>
          <td className="py-1 pr-2">
            <div className="float-right h-2 w-1/2 animate-pulse rounded bg-slate-200" />
          </td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Aroma</td>
          <td className="py-1">
            <div className="float-right h-2 w-1/2 animate-pulse rounded bg-slate-200" />
          </td>
          <td className="py-1 pr-2">
            <div className="float-right h-2 w-1/2 animate-pulse rounded bg-slate-200" />
          </td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Sweetness</td>
          <td className="py-1">
            <div className="float-right  h-2 w-1/2 animate-pulse rounded bg-slate-200" />
          </td>
          <td className="py-1 pr-2">
            <div className="float-right  h-2 w-1/2 animate-pulse rounded bg-slate-200" />
          </td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Body</td>
          <td className="py-1">
            <div className="float-right  h-2 w-1/2 animate-pulse rounded bg-slate-200" />
          </td>
          <td className="py-1 pr-2">
            <div className="float-right  h-2 w-1/2 animate-pulse rounded bg-slate-200" />
          </td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Finish</td>
          <td className="py-1">
            <div className="float-right  h-2 w-1/2 animate-pulse rounded bg-slate-200" />
          </td>
          <td className="py-1 pr-2">
            <div className="float-right  h-2 w-1/2 animate-pulse rounded bg-slate-200" />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Table = ({ review }: { review: Review }) => {
  return (
    <table className="text-small w-full text-left ">
      <thead>
        <tr>
          <th className="text-sm font-light">
            <span>{dayjs(review.createdAt).format("dddd D, MMM ")}</span>
            <span>{dayjs(review.createdAt).format("hh:mm a")}</span>
          </th>
          <th className="py-3 text-right font-normal">Quality</th>
          <th className="text-right font-normal">Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-red border-b">
          <td className="py-1">Acidity</td>
          <td className="py-1 pr-2 text-right">{review.acidity_quality}</td>
          <td className="py-1 pr-2 text-right">{review.acidity_quantity}</td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Aroma</td>
          <td className="py-1 pr-2 text-right">{review.aroma_quality}</td>
          <td className="py-1 pr-2 text-right">{review.aroma_quantity}</td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Sweetness</td>
          <td className="py-1 pr-2 text-right">{review.sweetness_quality}</td>
          <td className="py-1 pr-2 text-right">{review.sweetness_quantity}</td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Body</td>
          <td className="py-1 pr-2 text-right">{review.body_quality}</td>
          <td className="py-1 pr-2 text-right">{review.body_quantity}</td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Finish</td>
          <td className="py-1 pr-2 text-right">{review.finish_quality}</td>
          <td className="py-1 pr-2 text-right">{review.finish_quantity}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Reviews;
