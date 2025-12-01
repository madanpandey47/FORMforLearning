import React from "react";
import Link from "next/link";

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
              className="rounded-full border border-transparent px-3 py-1.5 text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
            >
              Open Form
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
