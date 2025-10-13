"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Exam {
  _id: string;
  name: string;
  subject: string;
  date: string; // ISO string
  duration: number; // minutes
  totalMarks: number;
  status: "Scheduled" | "Ongoing" | "Completed" | "Pending Evaluation";
  studentSubmissions?: {
    submittedAt?: string;
    marksObtained?: number;
  };
}

export default function ExamsPage() {
  const [filter, setFilter] = useState<"All" | "Scheduled" | "Ongoing" | "Completed" | "Pending Evaluation">("All");

  // Sample Data
  const exams: Exam[] = [
    {
      _id: "1",
      name: "Math Midterm",
      subject: "Mathematics",
      date: "2025-10-15T10:00:00Z",
      duration: 120,
      totalMarks: 100,
      status: "Scheduled",
    },
    {
      _id: "2",
      name: "Physics Quiz",
      subject: "Physics",
      date: "2025-10-11T14:00:00Z",
      duration: 60,
      totalMarks: 50,
      status: "Ongoing",
    },
    {
      _id: "3",
      name: "Chemistry Final",
      subject: "Chemistry",
      date: "2025-09-30T09:00:00Z",
      duration: 90,
      totalMarks: 75,
      status: "Completed",
      studentSubmissions: {
        submittedAt: "2025-09-30T10:30:00Z",
        marksObtained: 68,
      },
    },
    {
      _id: "4",
      name: "Biology Assessment",
      subject: "Biology",
      date: "2025-10-01T12:00:00Z",
      duration: 45,
      totalMarks: 40,
      status: "Pending Evaluation",
    },
  ];

  const filteredExams = exams.filter((exam) => filter === "All" || exam.status === filter);

  const handleStartExam = (exam: Exam) => {
    if (exam.status === "Scheduled") {
      alert("Exam is not started yet!");
    } else if (exam.status === "Ongoing") {
      alert(`Starting ${exam.name}...`);
    } else if (exam.status === "Completed") {
      alert(`Viewing submission of ${exam.name}`);
    } else if (exam.status === "Pending Evaluation") {
      alert(`Viewing result of ${exam.name}`);
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">Exams</h1>
      <p className="text-gray-300 mb-6">All your scheduled and completed exams.</p>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        {["All", "Scheduled", "Ongoing", "Completed", "Pending Evaluation"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            className={filter === f ? "bg-blue-600 text-white" : "border-blue-600 text-blue-400"}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => setFilter(f as any)}
          >
            {f}
          </Button>
        ))}
      </div>

      {/* No exams */}
      {filteredExams.length === 0 && <p className="text-gray-500">No exams found for this filter.</p>}

      {/* Exam Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <Card
            key={exam._id}
            className="border border-blue-700 bg-gray-900 shadow-md hover:shadow-xl transition-shadow"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-300">{exam.name}</CardTitle>
              <p className="text-sm text-white">{exam.subject}</p>
            </CardHeader>
            <CardContent>
              {/* <p className="text-white"><strong>Date:</strong> {new Date(exam.date).toLocaleString()}</p> */}
              <p className="text-white"><strong>Duration:</strong> {exam.duration} mins</p>
              <p className="text-white"><strong>Total Marks:</strong> {exam.totalMarks}</p>
              <p className="mt-2 text-white">
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-white text-sm ${
                    exam.status === "Scheduled"
                      ? "bg-blue-600"
                      : exam.status === "Ongoing"
                      ? "bg-green-600"
                      : exam.status === "Completed"
                      ? "bg-gray-500"
                      : "bg-orange-500"
                  }`}
                >
                  {exam.status}
                </span>
              </p>

              {/* Action Button */}
              <div className="mt-4">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleStartExam(exam)}
                >
                  {exam.status === "Scheduled"
                    ? "View Details"
                    : exam.status === "Ongoing"
                    ? "Start Exam"
                    : exam.status === "Completed"
                    ? "View Submission"
                    : "View Result"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
