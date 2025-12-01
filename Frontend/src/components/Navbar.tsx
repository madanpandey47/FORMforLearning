import React from "react";
import Link from "next/link";
import { FiEdit3 } from "react-icons/fi";

const Navbar: React.FC = () => {
  return (
    <nav className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-slate-900"
        >
          StudentForm
        </Link>
        <ul className="flex items-center gap-4 text-sm font-medium">
          <li>
            <Link
              href="/form"
              className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
            >
              <FiEdit3 className="h-4 w-4" />
              Form
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
