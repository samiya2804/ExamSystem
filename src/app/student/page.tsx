"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, BookOpen, BarChart2, Calendar, FileText, Clock, ChevronLeft, BarChart, CheckCircle } from "lucide-react";
import { useState, useMemo, useEffect , useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
    {
      id: "exam-python-1",
      subject: "Python",
      totalMarks: 75,
      durationInMinutes: 90,
      date: "2025-10-15",
      questions: [
        { id: "py1", type: "mcq", questionText: "Which of the following statements is true about Python tuples?", options: ["They are mutable", "They are immutable", "They can be modified"], correctAnswer: "They are immutable" },
        { id: "py2", type: "short_answer", questionText: "What is a decorator in Python?" },
        { id: "py3", type: "coding", questionText: "Write a Python function to check if a string is a palindrome." }
      ]
    },
    {
      id: "exam-empty-1",
      subject: "Data Science",
      totalMarks: 50,
      durationInMinutes: 60,
      date: "2025-11-01",
      questions: []
    }
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
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (activeExam) {
      setTimeLeft(activeExam.durationInMinutes * 60);
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setMessage("Time's up! Your exam has been submitted automatically.");
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
    setMessage("Exam submitted successfully!");
    setActiveExam(null);
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

   const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      setMessage(`File "${file.name}" uploaded successfully!`);
    }
  };

  const MessageToast = () => (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 p-4 bg-gray-800 text-white rounded-lg shadow-xl z-50 flex items-center gap-3"
        >
          <CheckCircle className="text-green-400 w-6 h-6" />
          <span>{message}</span>
          <Button onClick={handleCloseMessage} variant="ghost" className="p-1 h-auto text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!activeExam) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100 font-sans p-6 sm:p-10">
        <MessageToast />
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <header className="p-8 bg-gradient-to-br from-indigo-900  to-gray-900 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center shadow-inner">
                <span className="text-3xl font-bold text-blue-900">MI</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome, Student</h1>
                <p className="text-sm opacity-90 mt-1">Ready for your next challenge?</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">

              

              <Link href="/student/results" className="bg-white text-teal-600 hover:bg-teal-50 font-semibold transition-transform duration-200 transform hover:scale-105 rounded-full px-6 py-3 shadow">

                View All Results
              </Link>
            </div>
          </header>

          {/* Key Stats Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700 transform transition-transform duration-300 hover:scale-105">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-xl font-semibold text-white flex items-center space-x-2">
                  <BookOpen className="w-6 h-6 text-white" />
                  <span>Exams Available</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-5xl font-extrabold text-teal-600 mt-2">
                  {availableExams.length}
                </div>
                <p className="text-sm text-white mt-2">Upcoming tests on your schedule.</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700 transform transition-transform duration-300 hover:scale-105">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-xl font-semibold text-white flex items-center space-x-2">
                  <BarChart2 className="w-6 h-6 text-green-500" />
                  <span>Average Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-5xl font-extrabold text-green-600 mt-2">
                  {
                    pastResults.length > 0
                      ? `${(
                          pastResults.reduce((sum, res) => sum + (res.marksObtained / res.totalMarks), 0) /
                          pastResults.length
                        ).toFixed(0)}%`
                      : "N/A"
                  }
                </div>
                <p className="text-sm text-white mt-2">Your average performance.</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700  transform transition-transform duration-300 hover:scale-105">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-xl font-semibold text-white flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-yellow-500" />
                  <span>Exams Completed</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-5xl font-extrabold text-yellow-600 mt-2">
                  {pastResults.length}
                </div>
                <p className="text-sm text-white mt-2">Exams you have completed.</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700  transform transition-transform duration-300 hover:scale-105">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-xl font-semibold text-white flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  <span>Last Exam</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-blue-600 mt-2 mb-4">
                  {
                    pastResults.length > 0
                      ? pastResults[pastResults.length - 1].subject
                      : "None"
                  }
                </div>
                <p className="text-sm text-white mt-2">Most recent subject completed.</p>
              </CardContent>
            </Card>
          </section>

          {/* Upcoming Exams Section */}
          <section>
            <h2 className="text-3xl font-bold text-blue-600 mb-6">Upcoming Exams</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableExams.map((exam) => (
                <Card key={exam.id} className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700  flex flex-col justify-between transform transition-transform duration-300 hover:scale-105">
                  <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-semibold text-blue-800 flex items-center gap-3">
                      <BookOpen className="w-7 h-7" /> {exam.subject}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-4 flex-grow space-y-2 text-white">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Total Marks: {exam.totalMarks}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Duration: {exam.durationInMinutes} Minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Date: {exam.date}</span>
                    </div>
                  </CardContent>
                  {exam.questions.length > 0 ? (
                    <Button
                      onClick={() => setActiveExam(exam)}
                      className="w-full mt-6 flex items-center justify-center gap-2 py-3 transition-colors cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-3xl shadow-md"
                    >
                      <UploadCloud className="w-5 h-5" /> Start Exam
                    </Button>
                  ) : (
                    <div className="w-full mt-6 space-y-2">                   
                    <input
                        type="file"
                        id={`file-upload-${exam.id}`}
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor={`file-upload-${exam.id}`} className="w-full flex items-center justify-center gap-2 py-2 bg-blue-400 text-white hover:bg-blue-500 transition-colors duration-200 rounded-3xl shadow-md cursor-pointer">
                        <UploadCloud className="w-5 h-5" /> Upload Answer Sheet
                      </label>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>

          {/* Overall Performance Section */}
         <section>
  <h2 className="text-3xl font-bold text-indigo-400 mb-6">Overall Performance</h2>
  <Card className="rounded-2xl shadow-xl p-6 bg-gray-900/90 border border-gray-800 backdrop-blur-md">
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={averageMarksData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
          <XAxis dataKey="subject" stroke="#9ca3af" /> {/* gray axis labels */}
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1f2937", borderRadius: "0.5rem", border: "none" }}
            labelStyle={{ color: "#e5e7eb" }}
          />
          <Area 
            type="monotone" 
            dataKey="marks" 
            stroke="#6366f1" 
            fill="#3730a3"  // darker indigo fill
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </Card>
</section>

{/* Past Results Section */}
<section>
  <h2 className="text-3xl font-bold text-indigo-400 mb-6">Past Results</h2>
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {pastResults.map((res) => (
      <Card 
        key={res.id} 
        className="rounded-2xl shadow-lg p-6 bg-gray-900/90 border border-gray-800 transform transition-transform duration-300 hover:scale-105 backdrop-blur-md"
      >
        <CardHeader className="p-0">
          <CardTitle className="text-2xl font-semibold text-purple-400 flex items-center gap-3">
            <BarChart2 className="w-7 h-7 text-purple-400" /> {res.subject}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <p className="text-3xl font-bold text-gray-100">
            {res.marksObtained}/{res.totalMarks}
          </p>
          <p className="text-sm text-gray-400 mt-2">Topic-wise Performance:</p>
          <div className="w-full h-40 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={res.topicPerformance} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="topic" stroke="#9ca3af" className="text-xs" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", borderRadius: "0.5rem", border: "none" }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#22c55e" 
                  fill="#065f46" // darker green fill
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
</section>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800 border border-slate-700 text-white font-sans p-6 sm:p-10">
      <MessageToast />
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gray-700 rounded-3xl shadow-xl">
          <Button onClick={() => setActiveExam(null)} className="flex items-center gap-2 text-blue-600 font-semibold rounded-full bg-gray-700 hover:bg-gray-800 transition-transform duration-200 transform hover:scale-105">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
          <div className="text-center flex-1 mt-4 sm:mt-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{activeExam.subject} Exam</h1>
          </div>
          <div className="flex items-center space-x-2 text-red-600 font-bold bg-red-100 px-4 py-2 rounded-full shadow-inner mt-4 sm:mt-0">
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </header>

        <section className="space-y-8">
          {activeExam.questions.map((q, index) => (
            <Card key={q.id} className="p-8 rounded-3xl shadow-lg bg-gray-800">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl font-bold text-white">
                  Question {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <p className="text-lg font-medium text-white">{q.questionText}</p>
                {q.type === 'mcq' && (
                  <div className="space-y-4">
                    {q.options?.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-green-600 transition-colors">
                        <input type="radio" id={`q${q.id}-opt${optIndex}`} name={`q${q.id}`} className="form-radio text-teal-600 w-4 h-4" />
                        <label htmlFor={`q${q.id}-opt${optIndex}`} className="text-white font-medium flex-1 cursor-pointer">{option}</label>
                      </div>
                    ))}
                  </div>
                )}
                {q.type === 'short_answer' && (
                  <textarea rows={3} className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-white"></textarea>
                )}
                {q.type === 'long_answer' && (
                  <textarea rows={8} className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-white"></textarea>
                )}
                {q.type === 'coding' && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white">Code Here</p>
                    <textarea rows={12} className="w-full font-mono p-4 border border-gray-300 rounded-lg bg-gray-900 text-green-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"></textarea>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <div className="p-8 bg-gray-800 rounded-3xl shadow-lg text-center">
            <h3 className="text-xl font-bold text-white mb-2">Upload Answer Sheet (for handwritten sections)</h3>
            <p className="text-md text-white mb-6">Please ensure the file is clear and properly labeled.</p>
            <input type="file" className="text-sm text-white file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 transition-colors" />
          </div>

          <Button onClick={handleExamSubmission} className="w-full flex items-center justify-center gap-3 py-4 text-white font-bold bg-gradient-to-r from-blue-900 to-gray-800 cursor-pointer rounded-3xl shadow-md  ">
            <UploadCloud className="w-6 h-6" /> Submit Exam
          </Button>
        </section>
      </div>
    </div>
  );
}
