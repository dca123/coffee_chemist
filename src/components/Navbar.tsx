import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { Fragment } from "react";

const navigation = [
  { name: "Add Review", href: "/", current: true },
  { name: "Reviews", href: "/reviews", current: false },
  { name: "Add Coffee", href: "/coffee/new", current: false },
];

export const Navbar = () => {
  return (
    <Disclosure as="nav">
      <div className="flex items-center justify-between px-4">
        <Disclosure.Button>
          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
        </Disclosure.Button>
        Coffee Chemist
        <UserCircleIcon className="block h-6 w-6" aria-hidden="true" />
      </div>
      <Disclosure.Panel>
        <div className="absolute z-10 min-w-full space-y-1 rounded bg-slate-800 px-2 pt-4 pb-3 shadow-md">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                item.current
                  ? "text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 font-medium"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </Disclosure.Panel>
    </Disclosure>
  );
};
