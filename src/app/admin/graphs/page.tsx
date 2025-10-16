"use client";

import { useEffect, useState } from "react";
import ChartsPanel from "@/components/admin/ChartsPanel";
import Link from "next/link";

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-4 sm:px-6 md:px-8 py-6 flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-400 text-center sm:text-left">
          Admin Analytics
        </h1>

        <Link
          href="/admin"
          className="self-center sm:self-auto bg-indigo-700 hover:bg-indigo-800 
                     text-white px-3 py-2 text-xs sm:text-sm md:text-base 
                     rounded-lg shadow transition-all text-center"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Description */}
      <p className="text-gray-400 mb-8 text-xs sm:text-sm md:text-base text-center sm:text-left leading-relaxed">
        Explore detailed insights about exam performance, student activity, and faculty trends.
      </p>

      {/* Loading Spinner or Charts */}
      <div className="flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-400"></div>
          </div>
        ) : (
          <div className="overflow-x-auto pb-10">
            <ChartsPanel />
          </div>
        )}
      </div>
    </div>
  );
}
