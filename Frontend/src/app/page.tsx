import React from "react";
import Link from "next/link";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl px-8 py-16 shadow-xl">
      <h1 className="text-4xl md:text-5xl text-white font-semibold tracking-tight mb-4 text-center">
        Student Application Portal
      </h1>
      <p className="text-base md:text-lg text-slate-200 mb-8 max-w-2xl text-center">
        Fill out a guided, multi-step application form with your personal,
        academic, and financial details. You can review everything before
        submitting.
      </p>
      <Link
        href="/form"
        className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm md:text-base font-medium text-white shadow-md transition hover:bg-sky-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        Start Application
      </Link>
    </div>
  );
};

export default Home;
