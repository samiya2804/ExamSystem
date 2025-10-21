"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const params = useParams();
  const [studentId, setStudentId] = useState<string | null>(null);

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
    <div className="min-h-screen bg-slate-900 p-8">
      <h1 className="text-2xl font-bold text-white mb-4">Student Analytics</h1>

      <iframe
        src={`${process.env.NEXT_PUBLIC_ANALYTICS_MODEL_URL}/report/${studentId}`}
        width="100%"
        height="800"
        className="rounded-lg border border-slate-700 shadow-lg bg-white"
      ></iframe>
    </div>
  );
}
