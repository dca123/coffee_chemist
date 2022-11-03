import { signIn, signOut, useSession } from "next-auth/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <LoginButton />
      </div>
    );
  }

  return (
    <div>
      <div className="mt-5 mr-5 flex items-center justify-end space-x-4">
        <LoginButton />
      </div>
      {children}
    </div>
  );
};
export default Layout;

const LoginButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <div className="flex">
          <h3 className="text-md">Welcome,</h3>
          <span className="ml-1">{session.user?.name}</span>
        </div>
        <button className="rounded border p-2" onClick={() => signOut()}>
          Sign out
        </button>
      </>
    );
  }

  return (
    <button onClick={() => signIn()} className="rounded border p-2">
      Sign in
    </button>
  );
};
