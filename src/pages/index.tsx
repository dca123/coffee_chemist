import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  // const hello = trpc.review.reviews.useQuery();
  const form = useForm();
  return (
    <div>
      Create Review
      {/* <LoginButton /> */}
    </div>
  );
};

export default Home;

const LoginButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <span>
          {session.user?.name} - {session.user?.email}
        </span>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return <button onClick={() => signIn()}>Sign in</button>;
};
