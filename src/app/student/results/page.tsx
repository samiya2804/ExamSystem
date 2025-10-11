"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Trophy,
  BookOpen,
  Clock,
  Loader2,
  Hourglass,
  CheckCircle2,
}
 from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth"; // Reverting to alias for robustness

type Submission = {
  _id: string;
  examTitle: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  durationInMinutes: number;
  status: string;
};

export default function StudentResultsPage() {
  const { user } = useAuth();
  
  // Initialize with sample data to ensure the UI is visible immediately
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      _id: "sample-001",
      examTitle: "Sample Mid-Term (Evaluated)",
      subject: "Data Structures",
      marksObtained: 78,
      totalMarks: 100,
      durationInMinutes: 120,
      status: "evaluated",
    },
    {
      _id: "sample-002",
      examTitle: "Sample Final (Pending)",
      subject: "Database Systems",
      marksObtained: 0,
      totalMarks: 100,
      durationInMinutes: 180,
      status: "pending_evaluation",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use user?.id in dependency array for stable fetching
    if (!user?.id) {
        // If user ID is not available, stop loading and keep sample data visible
        setLoading(false); 
        return;
    }

    const fetchResults = async () => {
      // Start loading before fetch
      setLoading(true); 
      try {
        const res = await fetch(`/api/results?studentId=${user.id}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          // Mapping structure updated for clarity and safety based on populated fields
          const formatted = data.map((sub: any) => {
            const exam = sub.examId || {};
            const subjectObj = exam.subject || {};
            
            return {
              _id: sub._id,
              examTitle: exam.title || "Unknown Exam",
              subject: subjectObj.name || "Unknown Subject",
              marksObtained: sub.total_score || 0,
              // Backend is setting max_score to 80, but let's default to a safe value
              totalMarks: exam.totalMarks || sub.max_score || 100, 
              // Assuming examId population includes duration
              durationInMinutes: exam.duration || 0, 
              status: sub.status || "pending_evaluation",
            };
          });
          setSubmissions(formatted);
        } else {
          // If the fetch succeeds but returns no data, clear the sample data
          setSubmissions([]); 
        }
      } catch (err) {
        console.error("Error fetching results:", err);
        // On error, clear actual data but leave sample data if you uncomment initial state
        setSubmissions([]);
      } finally {
        // Stop loading after fetch completes (success or failure)
        setLoading(false); 
      }
    };

    fetchResults();
  // Changed dependency to user.id for stable fetching
  }, [user?.id]); 

  // Use window.location.href for robust navigation
  const handleBack = () => (window.location.href = "/student");
  
  // Use window.location.href for robust navigation
  const handleViewAnalytics = (id: string) => (window.location.href = `/student/analytics`);


  // Group submissions by subject
  const groupedBySubject = submissions.reduce(
    (acc: Record<string, Submission[]>, sub) => {
      // Ensure subject is a string and non-empty for grouping. 
      const subjectKey = sub.subject && typeof sub.subject === 'string' ? sub.subject : 'Unknown';
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
          <p className="text-blue-200 text-lg mt-2">
            Subject-wise performance overview
          </p>
        </motion.header>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-blue-400">
            <Loader2 className="w-10 h-10 animate-spin mb-3" />
            <p>Loading your results...</p>
          </div>
        )}

        {/* No Submissions */}
        {!loading && submissions.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-lg">
            No submissions found. Try completing an exam first.
          </div>
        )}

        {/* Subject-wise Results */}
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
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  {subject}
                </h2>
                <div className="h-[1px] bg-gradient-to-r from-blue-700 to-cyan-700 flex-1 ml-4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedBySubject[subject].map((sub) => {
                  const percentage =
                    sub.totalMarks > 0
                      ? (sub.marksObtained / sub.totalMarks) * 100
                      : 0;

                  return (
                    <Card
                      key={sub._id}
                      className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-blue-600/40 hover:scale-[1.02] transition-all"
                    >
                      <CardHeader className="flex justify-between items-start">
                        <CardTitle className="text-lg text-blue-300 font-semibold">
                          {sub.examTitle}
                        </CardTitle>

                        {/* Status Indicator */}
                        {sub.status === "evaluated" ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
                        ) : (
                          <Hourglass className="w-6 h-6 text-yellow-400 shrink-0" />
                        )}
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <p className="text-gray-300">
                          <span className="font-semibold text-blue-400">
                            Score:
                          </span>{" "}
                          {sub.status === "evaluated" ? (
                            <>
                              {sub.marksObtained}/{sub.totalMarks}{" "}
                              <span className="text-gray-400">
                                ({percentage.toFixed(2)}%)
                              </span>
                            </>
                          ) : (
                            <span className="text-yellow-400 italic">
                              Pending Evaluation
                            </span>
                          )}
                        </p>

                        <p className="text-gray-300 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />{" "}
                          Duration: {sub.durationInMinutes} min
                        </p>

                        {/* Button to view Detailed Analytics (only if evaluated) */}
                        {sub.status === "evaluated" ? (
                            <Button 
                                onClick={() => handleViewAnalytics(sub._id)}
                                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                View Details
                            </Button>
                        ) : (
                            <Button 
                                disabled
                                className="mt-4 w-full bg-gray-700 text-gray-400 cursor-not-allowed"
                            >
                                Analysis Not Ready
                            </Button>
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
