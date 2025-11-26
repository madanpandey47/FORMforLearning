import React from "react";
import Link from "next/link";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-500">
      <h1 className="text-4xl  text-white font-bold mb-8">Wassup</h1>
      <p className="text-lg text-white mb-8">Landing page. Go to the form.</p>
      <Link
        href="/form"
        className="px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Go to Form
      </Link>
    </div>
  );
};

export default Home;
