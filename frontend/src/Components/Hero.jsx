import React from "react";
import hero from "../assets/hero.png";
export default function Hero() {
  return (
    <section className="flex justify-center w-full mt-8">
      <div className="flex flex-col md:flex-row items-center bg-green-100 rounded-2xl shadow-md w-full max-w-6xl p-8 md:p-16 relative overflow-hidden">
        {/* Pattern background */}
        <div className="absolute inset-0 z-0">
          <img src={hero} alt="hero" className="w-full h-full object-cover" />
        </div>
        {/* Left: Text */}
        <div className="relative z-10 flex-1 text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
            Freshness You Can <br /> Trust, Savings You{" "}
            <br className="hidden md:block" /> will Love!
          </h1>
          <div className="mb-8">
            {/* Empty for spacing, as in screenshot */}
          </div>
          <div className="flex items-center space-x-6">
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-md text-lg font-semibold shadow-md transition">
              Shop now
            </button>
            <button className="flex items-center text-gray-800 font-semibold text-lg hover:underline">
              Explore deals
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
