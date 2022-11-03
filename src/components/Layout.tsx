import clsx from "clsx";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Spinner } from "./Spinner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <LoginButton />
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="mx-6 mt-5 flex items-center justify-between">
        <div className="space-x-4">
          <ActiveLink href={"/"}>Home</ActiveLink>
          <ActiveLink href={"/reviews"}>All Reviews</ActiveLink>
        </div>
        <LoginButton />
      </div>
      <div className="container mx-auto">{children}</div>
    </>
  );
};
export default Layout;

const ActiveLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  console.log(router.asPath);
  const style = clsx(
    "rounded border p-2 ",
    router.asPath === href ? "text-slate-200" : "text-slate-400"
  );

  return (
    <Link href={href} className={style}>
      {children}
    </Link>
  );
};

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
