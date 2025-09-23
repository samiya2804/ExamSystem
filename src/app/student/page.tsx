"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, BookOpen, BarChart2 } from "lucide-react";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Exam = {
  subject: string;
  totalMarks: number;
  duration: string;
  date: string;
};

type Result = {
  subject: string;
  marksObtained: number;
  totalMarks: number;
  topicPerformance: { topic: string; score: number }[];
};

export default function StudentDashboard() {
  const [availableExams, setAvailableExams] = useState<Exam[]>([
    { subject: "Java", totalMarks: 50, duration: "3 Hours", date: "2025-09-25" },
    { subject: "DBMS", totalMarks: 50, duration: "3 Hours", date: "2025-09-28" },
  ]);

  const [pastResults, setPastResults] = useState<Result[]>([
    {
      subject: "Java",
      marksObtained: 42,
      totalMarks: 50,
      topicPerformance: [
        { topic: "OOP", score: 9 },
        { topic: "Collections", score: 8 },
        { topic: "Exception Handling", score: 7 },
      ],
    },
    {
      subject: "DBMS",
      marksObtained: 38,
      totalMarks: 50,
      topicPerformance: [
        { topic: "ER Model", score: 8 },
        { topic: "Normalization", score: 7 },
        { topic: "SQL Queries", score: 6 },
      ],
    },
  ]);

  return (
    <div className="container mx-auto py-10 px-6 space-y-8">
      <h1 className="text-3xl font-bold text-indigo-600">Welcome, Mohammad Iqbal</h1>
      <p className="text-gray-600">Here are your exams and past results</p>

      {/* Available Exams */}
      <div className="grid md:grid-cols-2 gap-6">
        {availableExams.map((exam, idx) => (
          <Card key={idx} className="border shadow-md hover:shadow-xl transition">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" /> {exam.subject} Exam
              </CardTitle>
              <span className="text-sm text-gray-500">{exam.date}</span>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Total Marks: {exam.totalMarks}</p>
              <p>Duration: {exam.duration}</p>
              <Button className="mt-2 w-full flex items-center justify-center gap-2">
                <UploadCloud className="w-4 h-4" /> Upload Answer Sheet
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Past Results */}
      <h2 className="text-2xl font-semibold mt-8 text-indigo-600">Past Results</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {pastResults.map((res, idx) => (
          <Card key={idx} className="border shadow-md hover:shadow-xl transition">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-green-600" /> {res.subject} Result
              </CardTitle>
              <span className="text-sm text-gray-500">{res.marksObtained}/{res.totalMarks}</span>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Topic-wise Performance Chart */}
              <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={res.topicPerformance}>
                    <XAxis dataKey="topic" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" fill="#c7d2fe" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
