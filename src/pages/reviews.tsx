import { Review } from "@prisma/client";
import { NextPage } from "next";
import { trpc } from "../utils/trpc";
import dayjs from "dayjs";

const Reviews: NextPage = () => {
  const { isLoading, isError, data } = trpc.review.reviews.useQuery();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div>
      <h1 className="text-center text-xl font-light">Reviews</h1>
      {data.map((review) => (
        <div key={review.id} className="ml-4">
          <h2>{dayjs(review.createdAt).format("hh:mm a, dddd D, MMM ")}</h2>
          <div className="w-1/4">
            <Table review={review} />
          </div>
        </div>
      ))}
    </div>
  );
};

const Table = ({ review }: { review: Review }) => {
  return (
    <table className="text-small w-full text-left ">
      <thead>
        <tr>
          <th></th>
          <th className="py-3">Quality</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-red border-b">
          <td className="py-1">Acidity</td>
          <td className="py-1">{review.acidity_quality}</td>
          <td className="py-1">{review.acidity_quantity}</td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Aroma</td>
          <td className="py-1">{review.aroma_quality}</td>
          <td className="py-1">{review.aroma_quantity}</td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Sweetness</td>
          <td className="py-1">{review.sweetness_quality}</td>
          <td className="py-1">{review.sweetness_quantity}</td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Body</td>
          <td className="py-1">{review.body_quality}</td>
          <td className="py-1">{review.body_quantity}</td>
        </tr>
        <tr className="bg-red border-b">
          <td className="py-1">Finish</td>
          <td className="py-1">{review.finish_quality}</td>
          <td className="py-1">{review.finish_quantity}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Reviews;
