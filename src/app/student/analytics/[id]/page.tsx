"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Activity, Brain, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

const analyticsData = [
  { topic: "Arrays", marks: 15 },
  { topic: "Linked Lists", marks: 10 },
  { topic: "Trees", marks: 18 },
  { topic: "Graphs", marks: 14 },
  { topic: "Sorting", marks: 12 },
];

export default function AnalyticsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-blue-950 text-white p-8 sm:p-12">
      <header className="mb-10">
        <Button
          onClick={() => router.push("/student/results")}
          className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-full px-4 py-2 transition-all mb-6"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Results
        </Button>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Performance Analytics
        </h1>
        <p className="text-blue-200 mt-2">Visual breakdown of your strong and weak areas</p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-8 rounded-3xl shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-semibold text-blue-300">Topic-Wise Analysis</h2>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="topic" tick={{ fill: "#9ca3af" }} />
            <YAxis tick={{ fill: "#9ca3af" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#111827", border: "1px solid #2563eb", color: "#e0e7ff" }}
            />
            <Bar dataKey="marks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Suggestion Card */}
      <div className="mt-10 grid sm:grid-cols-2 gap-6">
        <div className="bg-gray-900/70 p-6 rounded-2xl border border-gray-800">
          <Brain className="w-8 h-8 text-blue-400 mb-2" />
          <h3 className="font-semibold text-lg text-blue-300 mb-1">Weak Areas</h3>
          <p className="text-gray-400 text-sm">
            Focus more on <span className="text-blue-400">Linked Lists</span> and <span className="text-blue-400">Sorting</span> for improvement.
          </p>
        </div>

        <div className="bg-gray-900/70 p-6 rounded-2xl border border-gray-800">
          <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
          <h3 className="font-semibold text-lg text-green-300 mb-1">How to Improve</h3>
          <p className="text-gray-400 text-sm">
            Practice topic-wise quizzes and revise theoretical concepts before attempting full-length tests.
          </p>
        </div>
      </div>
    </div>
  );
}