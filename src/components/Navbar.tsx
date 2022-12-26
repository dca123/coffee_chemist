import { Menu } from "@headlessui/react";
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

const navigation = [
  { name: "Add Review", href: "/", current: true },
  { name: "Reviews", href: "/reviews", current: false },
  { name: "Add Coffee", href: "/coffee/new", current: false },
];

export const Navbar = () => {
  return (
    <Menu>
      {({ open }) => (
        <>
          <div className="flex items-center justify-between px-4">
            <Menu.Button>
              {open ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </Menu.Button>
            Coffee Chemist
            <UserCircleIcon className="block h-6 w-6" aria-hidden="true" />
          </div>
          <Menu.Items>
            <div className="absolute z-10 min-w-full space-y-1 rounded bg-slate-800 px-2 pt-4 pb-3 shadow-md">
              {navigation.map((item) => (
                <LinkItem key={item.name} {...item} />
              ))}
            </div>
          </Menu.Items>
        </>
      )}
    </Menu>
  );
};

const LinkItem = ({ name, href }: { name: string; href: string }) => {
  const router = useRouter();
  const current = router.asPath === href;
  return (
    <Menu.Item>
      {({ active, close }) => (
        <Link
          onClick={close}
          href={href}
          className={clsx(
            current
              ? "text-white"
              : "text-gray-400 hover:bg-gray-700 hover:text-white",
            active ? "bg-gray-700" : "",
            "block rounded-md px-3 py-2 font-medium"
          )}
        >
          {name}
        </Link>
      )}
    </Menu.Item>
  );
};
