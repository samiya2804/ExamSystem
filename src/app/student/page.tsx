"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, BookOpen, BarChart2, Calendar, FileText, Clock, ChevronLeft } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// --- DATA TYPES ---
type Exam = {
  id: string;
  subject: string;
  totalMarks: number;
  durationInMinutes: number;
  date: string;
  questions: Question[];
};

type Result = {
  id: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  topicPerformance: { topic: string; score: number }[];
};

type Question = {
  id: string;
  type: 'mcq' | 'short_answer' | 'long_answer' | 'coding';
  questionText: string;
  options?: string[];
  correctAnswer?: string;
};

// --- MAIN COMPONENT ---
export default function StudentDashboard() {
  const [availableExams, setAvailableExams] = useState<Exam[]>([
    {
      id: "exam-java-1",
      subject: "Java",
      totalMarks: 50,
      durationInMinutes: 180,
      date: "2025-09-25",
      questions: [
        { id: "q1", type: "mcq", questionText: "What is polymorphism?", options: ["A concept in OOP", "A type of data structure", "A database model"], correctAnswer: "A concept in OOP" },
        { id: "q2", type: "short_answer", questionText: "Explain the difference between HashMap and Hashtable." },
        { id: "q3", type: "long_answer", questionText: "Describe the principles of SOLID design." },
        { id: "q4", type: "coding", questionText: "Write a program to reverse a string in Java without using built-in functions." },
      ],
    },
    {
      id: "exam-dbms-1",
      subject: "DBMS",
      totalMarks: 50,
      durationInMinutes: 180,
      date: "2025-09-28",
      questions: [
        { id: "q5", type: "mcq", questionText: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Logic"], correctAnswer: "Structured Query Language" },
        { id: "q6", type: "short_answer", questionText: "Define a database index." },
      ],
    },
    {
      id: "exam-dsa-1",
      subject: "Data Structures",
      totalMarks: 100,
      durationInMinutes: 180,
      date: "2025-10-25",
      questions: [
        { id: "q1", type: "mcq", questionText: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?", options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], correctAnswer: "O(log n)" },
        { id: "q2", type: "mcq", questionText: "Which data structure uses the Last-In, First-Out (LIFO) principle?", options: ["Queue", "Stack", "Linked List", "Hash Map"], correctAnswer: "Stack" },
        { id: "q3", type: "short_answer", questionText: "Explain the difference between a stack and a queue." },
        { id: "q4", type: "long_answer", questionText: "Describe the QuickSort algorithm. Include a discussion of its average and worst-case time complexity, and explain why its worst-case scenario occurs." },
        { id: "q5", type: "coding", questionText: "Write a function in C++ or Python that takes a string of parentheses (), brackets [], and braces {} and determines if the input string is valid. A string is valid if all open brackets are closed by the same type of brackets in the correct order." }
      ]
    },
  ]);

  const [pastResults, setPastResults] = useState<Result[]>([
    {
      id: "result-java-1",
      subject: "Java",
      marksObtained: 42,
      totalMarks: 50,
      topicPerformance: [
        { topic: "OOP", score: 9 },
        { topic: "Collections", score: 8 },
        { topic: "Exception Handling", score: 7 },
        { topic: "Multithreading", score: 10 },
        { topic: "Generics", score: 8 },
      ],
    },
    {
      id: "result-dbms-1",
      subject: "DBMS",
      marksObtained: 38,
      totalMarks: 50,
      topicPerformance: [
        { topic: "ER Model", score: 8 },
        { topic: "Normalization", score: 7 },
        { topic: "SQL Queries", score: 6 },
        { topic: "Transactions", score: 9 },
        { topic: "Indexes", score: 8 },
      ],
    },
  ]);

  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (activeExam) {
      setTimeLeft(activeExam.durationInMinutes * 60);
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            alert("Time's up! Your exam has been submitted automatically.");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeExam]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const averageMarksData = useMemo(() => {
    return pastResults.map((res) => ({
      subject: res.subject,
      marks: (res.marksObtained / res.totalMarks) * 100,
    }));
  }, [pastResults]);

  const handleExamSubmission = () => {
    alert("Exam submitted successfully!");
    setActiveExam(null);
  };

  if (!activeExam) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <header className="p-6 bg-gradient-to-r from-purple-500 to-teal-600 text-white rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-inner">
                  <span className="text-3xl font-bold text-teal-600">MI</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Welcome, Student</h1>
                  <p className="text-sm opacity-90 mt-1">Ready for your next challenge?</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <Button className="bg-white text-teal-600 hover:bg-teal-50 font-semibold transition-transform duration-200 transform hover:scale-105 rounded-full px-6 py-3 shadow">
                  View All Results
                </Button>
              </div>
            </div>
          </header>

          <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl shadow-md p-4 bg-white transform transition-transform hover:scale-105">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-teal-500" />
                    <span>Exams Available</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-4xl font-extrabold text-teal-600">
                  {availableExams.length}
                </div>
                <p className="text-sm text-gray-500 mt-1">Upcoming tests on your schedule.</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-md p-4 bg-white transform transition-transform hover:scale-105">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="w-5 h-5 text-green-500" />
                    <span>Average Score</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-4xl font-extrabold text-green-600">
                  {
                    pastResults.length > 0
                      ? `${(
                          pastResults.reduce((sum, res) => sum + (res.marksObtained / res.totalMarks), 0) /
                          pastResults.length
                        ).toFixed(2)}%`
                      : "N/A"
                  }
                </div>
                <p className="text-sm text-gray-500 mt-1">Your average performance.</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-md p-4 bg-white transform transition-transform hover:scale-105">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-yellow-500" />
                    <span>Total Exams</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-4xl font-extrabold text-yellow-600">
                  {pastResults.length}
                </div>
                <p className="text-sm text-gray-500 mt-1">Exams you have completed.</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-md p-4 bg-white transform transition-transform hover:scale-105">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span>Last Exam</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-lg font-bold text-blue-600">
                  {
                    pastResults.length > 0
                      ? pastResults[pastResults.length - 1].subject
                      : "None"
                  }
                </div>
                <p className="text-sm text-gray-500 mt-1">Most recent subject completed.</p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Exams</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableExams.map((exam) => (
                <Card key={exam.id} className="rounded-xl shadow-md p-4 bg-white transform transition-transform hover:scale-105">
                  <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-xl font-semibold text-teal-600 flex items-center gap-2 mb-2 sm:mb-0">
                      <BookOpen className="w-6 h-6" /> {exam.subject}
                    </CardTitle>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {exam.date}
                    </span>
                  </CardHeader>
                  <CardContent className="p-0 mt-4 space-y-2">
                    <p className="text-gray-600">Total Marks: {exam.totalMarks}</p>
                    <p className="text-gray-600">Duration: {exam.durationInMinutes} Minutes</p>
                    <Button onClick={() => setActiveExam(exam)} className="w-full mt-4 flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 rounded-lg shadow-md">
                      <UploadCloud className="w-4 h-4" /> Start Exam
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Past Results</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastResults.map((res) => (
                <Card key={res.id} className="rounded-xl shadow-md p-4 bg-white transform transition-transform hover:scale-105">
                  <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-xl font-semibold text-green-600 flex items-center gap-2 mb-2 sm:mb-0">
                      <BarChart2 className="w-6 h-6" /> {res.subject}
                    </CardTitle>
                    <span className="text-lg font-bold text-gray-800">
                      {res.marksObtained}/{res.totalMarks}
                    </span>
                  </CardHeader>
                  <CardContent className="p-0 mt-4 space-y-3">
                    <p className="text-sm text-gray-500">Topic-wise Performance:</p>
                    <div className="w-full h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={res.topicPerformance} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                          <XAxis dataKey="topic" className="text-xs" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="score" stroke="#22c55e" fill="#86efac" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Overall Performance</h2>
            <Card className="rounded-xl shadow-md p-6 bg-white">
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={averageMarksData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="marks" stroke="#6366f1" fill="#c7d2fe" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-lg">
          <Button onClick={() => setActiveExam(null)} className="flex items-center gap-2 text-teal-600 font-semibold rounded-full bg-gray-100 hover:bg-gray-200 transition-transform duration-200 transform hover:scale-105">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{activeExam.subject} Exam</h1>
          </div>
          <div className="flex items-center space-x-2 text-red-600 font-bold bg-red-100 px-4 py-2 rounded-full shadow-inner">
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </header>

        <section className="space-y-6">
          {activeExam.questions.map((q, index) => (
            <Card key={q.id} className="p-6 rounded-xl shadow-md bg-white">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Question {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <p className="text-gray-700">{q.questionText}</p>
                {q.type === 'mcq' && (
                  <div className="space-y-2">
                    {q.options?.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2">
                        <input type="radio" id={`q${q.id}-opt${optIndex}`} name={`q${q.id}`} className="form-radio text-teal-600" />
                        <label htmlFor={`q${q.id}-opt${optIndex}`} className="text-gray-600">{option}</label>
                      </div>
                    ))}
                  </div>
                )}
                {q.type === 'short_answer' && (
                  <textarea rows={2} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"></textarea>
                )}
                {q.type === 'long_answer' && (
                  <textarea rows={6} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"></textarea>
                )}
                {q.type === 'coding' && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Code Sandbox Placeholder</p>
                    <textarea rows={10} className="w-full font-mono p-3 border border-gray-300 rounded-lg bg-gray-900 text-green-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"></textarea>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <div className="p-6 bg-white rounded-xl shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Answer Sheet (for handwritten sections)</h3>
            <p className="text-sm text-gray-500 mb-4">Please ensure the file is clear and properly labeled.</p>
            <input type="file" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
          </div>

          <Button onClick={handleExamSubmission} className="w-full flex items-center justify-center gap-2 py-4 text-white font-bold bg-teal-600 hover:bg-teal-700 rounded-lg shadow-md transition-transform duration-200 transform hover:scale-105">
            <UploadCloud className="w-5 h-5" /> Submit Exam
          </Button>
        </section>
      </div>
    </div>
  );
}
