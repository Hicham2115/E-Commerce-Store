import React from "react";

export default function Newsletter() {
  return (
    <section className="w-full flex flex-col items-center py-16">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">Never Miss a Deal!</h2>
      <p className="text-lg text-gray-500 mb-10 text-center max-w-xl">Subscribe to get the latest offers, new arrivals, and exclusive discounts</p>
      <form className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-center gap-4">
        <input
          type="email"
          placeholder="Enter your email id"
          className="flex-1 border border-gray-300 rounded-md py-3 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-200 transition"
        />
        <button
          type="submit"
          className="bg-green-400 hover:bg-green-500 text-white font-semibold rounded-md px-8 py-3 text-lg transition"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
} 