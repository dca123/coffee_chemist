import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment } from "react";

const navigation = [
  { name: "Home", href: "#", current: true },
  { name: "Reviews", href: "#", current: false },
  { name: "Coffees", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
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
        <div className="z-10 space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <div
              key={item.name}
              className={clsx(
                item.current
                  ? "text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white",
                "rounded-md px-3 py-2 font-medium"
              )}
            >
              {item.name}
            </div>
          ))}
        </div>
      </Disclosure.Panel>
    </Disclosure>
  );
};
