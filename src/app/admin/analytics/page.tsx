"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // just a small delay for a smoother transition
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <h1 className="text-2xl font-bold text-white mb-4">
        Admin Analytics Dashboard
      </h1>
      <iframe
        src={`${process.env.NEXT_PUBLIC_ANALYTICS_MODEL_URL}`}
        width="100%"
        height="900"
        className="rounded-xl border border-slate-700 shadow-xl bg-white"
      ></iframe>
    </div>
  );
}
