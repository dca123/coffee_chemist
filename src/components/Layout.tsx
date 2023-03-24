import clsx from "clsx";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Navbar } from "./Navbar";
import { Spinner } from "./Spinner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  if (status === "unauthenticated") {
    return (
      <div>
        <Head>
          <title>Coffee Chemist</title>
        </Head>
        <div className="flex h-screen flex-col items-center justify-center">
          <LoginButton />
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div>
        <Head>
          <title>Coffee Chemist</title>
        </Head>
        <div className="flex h-screen flex-col items-center justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 h-screen">
      <Head>
        <title>Coffee Chemist</title>
      </Head>
      <Navbar />
      <div className="container mx-auto">{children}</div>
    </div>
  );
};
export default Layout;

const LoginButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-row items-center space-x-4">
        <div className="flex">
          <h3 className="text-md">Welcome,</h3>
          <span className="ml-1">{session.user?.name}</span>
        </div>
        <button className="rounded border p-2" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn()} className="rounded border p-2">
      Sign in
    </button>
  );
};
