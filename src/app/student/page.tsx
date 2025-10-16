"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  BookOpen,
  BarChart2,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import axios from "axios";

const Link = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <a href={href} className={className}>
    {children}
  </a>
);

// --- DATA TYPES ---
type Question = { Q_ID: string; question: string; options?: string[] };
type QuestionPaper = {
  MCQs?: Question[];
  Theory?: Question[];
  Coding?: Question[];
};
type Exam = {
  _id: string;
  title: string;
  subject: { name: string; code?: string };
  duration: number;
  date: string;
  questions: QuestionPaper;
  isPublished: boolean;
  publishedAt?: string;
};
type EvaluationDetail = {
  question_id: string;
  question_type: string;
  evaluation?: Record<string, any>;
  error?: string;
};
type Result = {
  _id: string;
  subject: { name: string; code?: string };
  student_id: string;
  total_score: number;
  max_score: number;
  evaluation_details: EvaluationDetail[];
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [pastResults, setPastResults] = useState<Result[]>([]);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finishedExams] = useState<Set<string>>(new Set());
  const [submittedExams, setSubmittedExams] = useState<Set<string>>(new Set());

  // Fetch submitted exams
  useEffect(() => {
    if (!user?.id) return;

    const fetchSubmittedExams = async () => {
      try {
        const res = await axios.get(`/api/submit-exam/check?studentId=${user.id}`);
        const submittedIds: Set<string> = new Set(
          res.data.submissions.map((s: any) => String(s.examId))
        );
        setSubmittedExams(submittedIds);
      } catch (err) {
        console.error("Failed to fetch submitted exams", err);
      }
    };

    fetchSubmittedExams();
  }, [user]);

  // Fetch dashboard data
  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const examsResponse = await axios.get("/api/exams");
        const publishedExams = examsResponse.data.filter(
          (exam: Exam) => exam.isPublished
        );
        setAvailableExams(publishedExams);

        // const resultsResponse = await axios.get(`/api/results?studentId=${user.id}`);
        // setPastResults(resultsResponse.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const averageMarksData = useMemo(
    () =>
      pastResults.map((res) => ({
        subject: res.subject?.name || "Exam",
        marks: res.max_score > 0 ? (res.total_score / res.max_score) * 100 : 0,
      })),
    [pastResults]
  );

  const handleCloseMessage = () => setMessage(null);

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
          <Button
            onClick={handleCloseMessage}
            variant="ghost"
            className="p-1 h-auto text-gray-400 hover:text-white"
          >
            ×
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <p>Loading dashboard...</p><br />
        <p>If you didn't see any data then please login again...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );

  if (!activeExam) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100 font-sans p-6 sm:p-10">
        <MessageToast />
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <header className="p-8 bg-gradient-to-br from-indigo-900 to-gray-900 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center shadow-inner">
                <span className="text-3xl font-bold text-blue-300">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome, {user?.firstName}</h1>
                <p className="text-sm opacity-90 mt-1">
                  Ready for your next challenge?
                </p>
              </div>
            </div>

            <div className="mt-4 sm:mt-0 flex gap-3">
              <Link href={`/student/results/${user?.id}`}>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold transition-transform duration-200 transform hover:scale-105 rounded-full px-6 py-3 shadow">
                  View Results
                </Button>
              </Link>
              <Link href="/student/analytics">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold transition-transform duration-200 transform hover:scale-105 rounded-full px-6 py-3 shadow">
                  View Analytics
                </Button>
              </Link>
            </div>
          </header>

          {/* Key Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700">
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
                <p className="text-sm text-white mt-2">
                  Upcoming tests on your schedule.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-xl font-semibold text-white flex items-center space-x-2">
                  <BarChart2 className="w-6 h-6 text-green-500" />
                  <span>Average Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-5xl font-extrabold text-green-600 mt-2">
                  {pastResults.length > 0
                    ? `${(
                        (pastResults.reduce(
                          (sum, res) =>
                            sum +
                            (res.max_score > 0
                              ? res.total_score / res.max_score
                              : 0),
                          0
                        ) /
                          pastResults.length) *
                        100
                      ).toFixed(0)}%`
                    : "N/A"}
                </div>
                <p className="text-sm text-white mt-2">
                  Your average performance.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700">
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
                <p className="text-sm text-white mt-2">
                  Exams you have completed.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-xl font-semibold text-white flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  <span>Last Exam</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-blue-600 mt-2 mb-4">
                  {pastResults.length > 0
                    ? pastResults[pastResults.length - 1].subject?.name
                    : "None"}
                </div>
                <p className="text-sm text-white mt-2">
                  Most recent subject completed.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Upcoming Exams */}
          <section>
            <h2 className="text-3xl font-bold text-blue-600 mb-6">
              Upcoming Exams
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableExams.map((exam) => {
                const isSubmitted = submittedExams.has(exam._id);
                const hasQuestions =
                  (exam.questions.MCQs?.length ?? 0) > 0 ||
                  (exam.questions.Theory?.length ?? 0) > 0;

                const displayDate = exam.publishedAt
                  ? new Date(exam.publishedAt).toLocaleDateString()
                  : new Date(exam.date).toLocaleDateString();

                return (
                  <Card
                    key={exam._id}
                    className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700 flex flex-col justify-between"
                  >
                    <CardHeader className="p-0">
                      <CardTitle className="text-2xl font-semibold text-blue-800 flex items-center gap-3">
                        <BookOpen className="w-7 h-7" /> {exam.subject.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 mt-4 flex-grow space-y-2 text-white">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Duration: {exam.duration} Minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Published: {displayDate}</span>
                      </div>
                    </CardContent>
                    {isSubmitted ? (
                      <div className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-3xl font-semibold shadow-lg">
                        <CheckCircle className="w-5 h-5" /> Already Submitted
                      </div>
                    ) : hasQuestions ? (
                      <Button
                        onClick={() => {
                          if (user?.id)
                            sessionStorage.setItem(
                              "temp_exam_student_id",
                              user.id
                            );
                          window.open(`/student/exam/${exam._id}`, "_blank");
                        }}
                        className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl"
                      >
                        <UploadCloud className="w-5 h-5" /> Start Exam
                      </Button>
                    ) : (
                      <div className="w-full mt-6 text-center text-gray-400 text-sm">
                        Questions not yet available.
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return null;

}
