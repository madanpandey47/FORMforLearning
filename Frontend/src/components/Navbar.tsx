import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          FormApp
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link
              href="/form"
              className="text-orange-500 text-xl font-extrabold hover:text-white"
            >
              Form
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
