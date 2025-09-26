"use client";

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2, Trophy, Clock, BookOpen } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Import the useRouter hook

// --- DATA TYPES ---
type TopicPerformance = {
  topic: string;
  marks: number;
};

type Result = {
  id: string;
  examTitle: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  durationInMinutes: number;
  topicPerformance: TopicPerformance[];
};

// --- MAIN COMPONENT ---
export default function StudentResultsPage() {
  const router = useRouter(); // Initialize the router
  
  const [result, setResult] = useState<Result>({
    id: "result-001",
    examTitle: "Mid-Term Exam",
    subject: "Data Structures",
    marksObtained: 78,
    totalMarks: 100,
    durationInMinutes: 120,
    topicPerformance: [
      { topic: "Arrays", marks: 15 },
      { topic: "Linked Lists", marks: 12 },
      { topic: "Trees", marks: 18 },
      { topic: "Graphs", marks: 16 },
      { topic: "Sorting", marks: 17 },
    ],
  });

  // Calculate percentage
  const percentage = (result.marksObtained / result.totalMarks) * 100;

  // Function to navigate back to the dashboard using the router
  const handleBackToDashboard = () => {
    router.push('/student');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="p-8 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-3xl shadow-xl">
          <Button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-white font-semibold rounded-full px-4 py-2 bg-white/10 hover:bg-white/20 transition-transform duration-200 transform hover:scale-105 mb-6"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold">{result.examTitle} - Results</h1>
          <p className="text-xl opacity-90 mt-2">Subject: {result.subject}</p>
        </header>

        {/* Performance Summary Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Marks Card */}
          <Card className="rounded-3xl shadow-lg p-6 bg-white transform transition-transform hover:scale-105">
            <CardHeader className="p-0 mb-4 flex-row justify-between items-center">
              <CardTitle className="text-xl font-bold text-gray-800">Your Score</CardTitle>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-5xl font-extrabold text-teal-600">
                {result.marksObtained}
                <span className="text-2xl font-normal text-gray-500">/{result.totalMarks}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Marks obtained in the exam.</p>
            </CardContent>
          </Card>

          {/* Percentage Card */}
          <Card className="rounded-3xl shadow-lg p-6 bg-white transform transition-transform hover:scale-105">
            <CardHeader className="p-0 mb-4 flex-row justify-between items-center">
              <CardTitle className="text-xl font-bold text-gray-800">Overall Percentage</CardTitle>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-5xl font-extrabold text-cyan-600">
                {percentage.toFixed(2)}%
              </div>
              <p className="text-sm text-gray-500 mt-2">Your total performance.</p>
            </CardContent>
          </Card>

          {/* Duration Card */}
          <Card className="rounded-3xl shadow-lg p-6 bg-white transform transition-transform hover:scale-105">
            <CardHeader className="p-0 mb-4 flex-row justify-between items-center">
              <CardTitle className="text-xl font-bold text-gray-800">Time Taken</CardTitle>
              <Clock className="w-8 h-8 text-blue-500" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-5xl font-extrabold text-gray-600">
                {result.durationInMinutes}
                <span className="text-2xl font-normal text-gray-500"> min</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Total time spent on the exam.</p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Topic-wise Performance Chart */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <Card className="rounded-3xl shadow-lg p-6 bg-white">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-600" /> Topic-wise Performance
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                A detailed breakdown of your marks across each topic.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.topicPerformance} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="topic" className="text-xs" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="marks" stroke="#14b8a6" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.section>

        {/* Concluding message and navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <p className="text-lg text-gray-700">Congratulations on completing your exam!</p>
          <Button
            onClick={handleBackToDashboard}
            className="mt-6 flex items-center justify-center mx-auto gap-2 py-3 px-8 text-white font-bold bg-teal-600 hover:bg-teal-700 rounded-full shadow-md transition-transform duration-200 transform hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" /> Go to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
