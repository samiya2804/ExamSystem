"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ChevronLeft, BookOpen, Clock, Loader2, Hourglass, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

type EvaluationDetail = {
  questionText: string;
  scoreObtained: number;
  maximumScore: number;
  feedback: string;
};

type Submission = {
  _id: string;
  examTitle: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  durationInMinutes: number;
  status: string;
  evaluationDetails?: EvaluationDetail[];
};

export default function StudentResultsPage() {
  const params = useParams();
  const studentId = params?.id;

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) {
      console.error("Missing studentId in route or query params!");
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/results?studentId=${studentId}`);
        const data = res.data;

        const formatted: Submission[] = (data || []).map((result: any) => {
          const exam = result.examId || {};
          const subjectName = exam.subject?.name || "Unknown Subject";
          return {
            _id: result._id,
            examTitle: exam.title || "Untitled Exam",
            subject: subjectName,
            marksObtained: result.totalMarksObtained || 0,
            totalMarks: result.totalMaxMarks || 100,
            durationInMinutes: exam.duration || 0,
            status: result.totalMarksObtained != null ? "evaluated" : "pending_evaluation",
            evaluationDetails: result.evaluationDetails?.map((q: any) => ({
              questionText: q.questionText,
              scoreObtained: q.scoreObtained,
              maximumScore: q.maximumScore,
              feedback: q.feedback,
            })),
          };
        });

        setSubmissions(formatted);
      } catch (err) {
        console.error("Error fetching results:", err);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [studentId]);

  const handleBack = () => (window.location.href = "/student");

  const groupedBySubject = submissions.reduce(
    (acc: Record<string, Submission[]>, sub) => {
      const subjectKey = sub.subject || "Unknown";
      if (!acc[subjectKey]) acc[subjectKey] = [];
      acc[subjectKey].push(sub);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-blue-950 text-white font-sans p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-blue-700 via-cyan-700 to-blue-900 rounded-3xl p-8 shadow-xl"
        >
          <Button
            onClick={handleBack}
            className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 rounded-full px-4 py-2 transition-all mb-4"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-white">Your Exam Results</h1>
          <p className="text-blue-200 text-lg mt-2">Subject-wise performance overview</p>
        </motion.header>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-blue-400">
            <Loader2 className="w-10 h-10 animate-spin mb-3" />
            <p>Loading your results...</p>
          </div>
        )}

        {/* No submissions */}
        {!loading && submissions.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-lg">
            No submissions found. Try completing an exam first.
          </div>
        )}

        {/* Results */}
        {!loading &&
          Object.keys(groupedBySubject).map((subject) => (
            <motion.section
              key={subject}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-400" /> {subject}
                </h2>
                <div className="h-[1px] bg-gradient-to-r from-blue-700 to-cyan-700 flex-1 ml-4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedBySubject[subject].map((sub) => {
                  const percentage = sub.totalMarks > 0 ? (sub.marksObtained / sub.totalMarks) * 100 : 0;

                  return (
                    <Card
                      key={sub._id}
                      className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-blue-600/40 hover:scale-[1.02] transition-all"
                    >
                      <CardHeader className="flex justify-between items-start">
                        <CardTitle className="text-lg text-blue-300 font-semibold">{sub.examTitle}</CardTitle>
                        {sub.status === "evaluated" ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
                        ) : (
                          <Hourglass className="w-6 h-6 text-yellow-400 shrink-0" />
                        )}
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <p className="text-gray-300">
                          <span className="font-semibold text-blue-400">Score:</span>{" "}
                          {sub.status === "evaluated" ? (
                            <>
                              {sub.marksObtained}/{sub.totalMarks}{" "}
                              <span className="text-gray-400">({percentage.toFixed(2)}%)</span>
                            </>
                          ) : (
                            <span className="text-yellow-400 italic">Pending Evaluation</span>
                          )}
                        </p>

                        <p className="text-gray-300 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" /> Duration: {sub.durationInMinutes} min
                        </p>

                        {/* Responsive & scrollable modal */}
                        {sub.status === "evaluated" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white">
                                View Results
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl w-[90vw] sm:w-[80vw] lg:w-[60vw] max-h-[90vh] overflow-y-auto rounded-3xl p-6 bg-gray-900 shadow-xl">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-white">
                                  {sub.examTitle} - Detailed Results
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                {sub.evaluationDetails?.map((q, i) => (
                                  <Card
                                    key={i}
                                    className="bg-gray-800 border border-gray-700 rounded-xl shadow-md"
                                  >
                                    <CardContent className="space-y-2">
                                      <p className="font-semibold text-blue-300">{q.questionText}</p>
                                      <p className="text-gray-200">
                                        Marks: {q.scoreObtained}/{q.maximumScore}
                                      </p>
                                      <p className="text-gray-400">{q.feedback}</p>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                              <DialogClose asChild>
                                <Button className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white rounded-xl">
                                  Close
                                </Button>
                              </DialogClose>
                            </DialogContent>
                          </Dialog>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.section>
          ))}
      </div>
    </div>
  );
}
