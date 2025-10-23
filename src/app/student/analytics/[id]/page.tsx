"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const params = useParams();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (params?.id) {
      setStudentId(params.id as string);
    }
  }, [params]);

  if (!studentId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-900 p-8">
      {/* Loader overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 z-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg font-medium">Loading report...</p>
        </div>
      )}

      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        Student Analytics Dashboard
      </h1>

      <iframe
        src={`${process.env.NEXT_PUBLIC_ANALYTICS_MODEL_URL}/report/${studentId}`}
        width="100%"
        height="800"
        className="rounded-lg border border-slate-700 shadow-lg bg-white"
        onLoad={handleIframeLoad}
      ></iframe>
    </div>
  );
}
