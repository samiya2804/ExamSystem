"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, BookOpen, BarChart2, Calendar, FileText, Clock, ChevronLeft, BarChart, CheckCircle } from "lucide-react";
import { useState, useMemo, useEffect , useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import axios from 'axios';

// --- DATA TYPES ---
// Updated types to match backend schema (_id)
type Question = {
  _id: string;
  type: 'mcq' | 'short_answer' | 'long_answer' | 'coding';
  questionText: string;
  options?: string[];
  correctAnswer?: string;
};

type Exam = {
  _id: string;
  title: string;
  subject: string;
  durationInMinutes: number;
  date: string;
  questions: Question[];
  isPublished: boolean; // Add this to filter on the client side
};

type Result = {
  _id: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  topicPerformance: { topic: string; score: number }[];
};

// --- MAIN COMPONENT ---
export default function StudentDashboard() {
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [pastResults, setPastResults] = useState<Result[]>([]);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const examsResponse = await axios.get('/api/exams');
        // Filter exams that have been published by the faculty
        const publishedExams = examsResponse.data.filter((exam: Exam) => exam.isPublished);
        setAvailableExams(publishedExams);

        // TODO: Uncomment this when you create the backend API for results
        // const resultsResponse = await axios.get('/api/results');
        // setPastResults(resultsResponse.data);

        // For now, keep some mock results to make the charts work
        const mockResults: Result[] = [{
          _id: "result-java-1",
          subject: "Java",
          marksObtained: 42,
          totalMarks: 50,
          topicPerformance: [
            { topic: "OOP", score: 9 }, { topic: "Collections", score: 8 },
            { topic: "Exception Handling", score: 7 }, { topic: "Multithreading", score: 10 },
            { topic: "Generics", score: 8 },
          ],
        }];
        setPastResults(mockResults);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Conditional rendering for loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100 font-sans p-6 sm:p-10 flex items-center justify-center">
        <p className="text-xl">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100 font-sans p-6 sm:p-10 flex items-center justify-center">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!activeExam) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100 font-sans p-6 sm:p-10">
        <MessageToast />
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <header className="p-8 bg-gradient-to-br from-indigo-900 to-gray-900 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between">
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


              <Button className="bg-gray-700 text-blue-600 hover:bg-teal-50 font-semibold transition-transform duration-200 transform hover:scale-105 rounded-full px-6 py-3 shadow">
            <Link href="/student/results" className="bg-white text-teal-600 hover:bg-teal-50 font-semibold transition-transform duration-200 transform hover:scale-105 rounded-full px-6 py-3 shadow">
                View All Results
              </Link>
              </Button>
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

            <Card className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700 transform transition-transform duration-300 hover:scale-105">
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

            <Card className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700 transform transition-transform duration-300 hover:scale-105">
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
                <Card key={exam._id} className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105">
                  <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-semibold text-blue-800 flex items-center gap-3">
                      <BookOpen className="w-7 h-7" /> {exam.subject}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-4 flex-grow space-y-2 text-white">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {/* You will need to add total marks to the Exam schema if you want to display this dynamically */}
                      <span>Duration: {exam.durationInMinutes} Minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Date: {new Date(exam.date).toLocaleDateString()}</span>
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
                        id={`file-upload-${exam._id}`}
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor={`file-upload-${exam._id}`} className="w-full flex items-center justify-center gap-2 py-2 bg-blue-400 text-white hover:bg-blue-500 transition-colors duration-200 rounded-3xl shadow-md cursor-pointer">
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
                  key={res._id}
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
 <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900 text-white font-sans p-6 sm:p-10">
  <MessageToast />
  <div className="max-w-5xl mx-auto space-y-6">
    {/* HEADER */}
    <header className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-3xl shadow-2xl border border-gray-600">
      <Button
        onClick={() => setActiveExam(null)}
        className="flex items-center gap-2 text-blue-400 font-semibold rounded-full bg-gray-800 border border-gray-600 hover:bg-blue-900 hover:text-white transition-all duration-200 transform hover:scale-105 px-5 py-2"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </Button>

      <div className="text-center flex-1 mt-4 sm:mt-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-400 drop-shadow-md">
          {activeExam.subject} Exam
        </h1>
      </div>

      <div className="flex items-center space-x-2 text-red-600 font-bold bg-gradient-to-r from-red-200 to-red-100 px-5 py-2 rounded-full shadow-md mt-4 sm:mt-0">
        <Clock className="w-5 h-5" />
        <span className="text-red-800">{formatTime(timeLeft)}</span>
      </div>
    </header>

    {/* QUESTIONS */}
    <section className="space-y-8">
      {activeExam.questions.map((q, index) => (
        <Card
          key={q._id}
          className="p-8 rounded-3xl shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500 transition-all duration-300"
        >
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl font-bold text-blue-300">
              Question {index + 1}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 space-y-6">
            <p className="text-lg font-medium text-white">{q.questionText}</p>

            {q.type === "mcq" && (
              <div className="space-y-4">
                {q.options?.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-blue-700 hover:border-blue-500 transition-all duration-200"
                  >
                    <input
                      type="radio"
                      id={`q${q._id}-opt${optIndex}`}
                      name={`q${q._id}`}
                      className="form-radio text-blue-500 w-4 h-4"
                    />
                    <label
                      htmlFor={`q${q._id}-opt${optIndex}`}
                      className="text-white font-medium flex-1 cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}
{q.type === "short_answer" && (
  <textarea
    rows={3}
    placeholder="Type your short answer here..."
    className="w-full p-4 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  ></textarea>
)}

{q.type === "long_answer" && (
  <textarea
    rows={8}
    placeholder="Write your detailed answer here..."
    className="w-full p-4 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  ></textarea>
)}

{q.type === "coding" && (
  <div className="space-y-2">
    <p className="text-sm font-medium text-blue-300">Code Here</p>
    <textarea
      rows={12}
      placeholder="// Write your code here..."
      className="w-full font-mono p-4 border border-gray-600 rounded-lg bg-gray-950 text-green-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    ></textarea>
  </div>
)}

          </CardContent>
        </Card>
      ))}

      {/* FILE UPLOAD */}
      <div className="p-8 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-3xl shadow-xl text-center">
        <h3 className="text-xl font-bold text-blue-300 mb-2">
          Upload Answer Sheet (for handwritten sections)
        </h3>
        <p className="text-md text-gray-300 mb-6">
          Please ensure the file is clear and properly labeled.
        </p>
        <input
          type="file"
          className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-200 file:text-blue-900 hover:file:bg-blue-300 transition-colors"
        />
      </div>

      {/* SUBMIT BUTTON */}
      <Button
        onClick={handleExamSubmission}
        className="w-full flex items-center justify-center gap-3 py-4 text-white font-bold rounded-3xl shadow-lg bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 hover:from-blue-500 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
      >
        <UploadCloud className="w-6 h-6" /> Submit Exam
      </Button>
    </section>
  </div>
</div>

  );
}