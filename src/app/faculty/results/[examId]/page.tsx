"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, BarChart2, Eye } from "lucide-react";

type EvaluationDetail = {
  questionText: string;
  scoreObtained: number;
  maximumScore: number;
  studentAnswer?: string;
  feedback: string;
};

type Submission = {
  _id: string;
  studentId: string;
  status: "pending_evaluation" | "evaluated";
  total_score: number;
  max_score: number;
  evaluation_report?: {
    evaluation_details?: EvaluationDetail[];
  };
  createdAt: string;
};

export default function ExamResultsPage() {
  const params = useParams();
  const examId = params.examId as string;
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [editingReport, setEditingReport] = useState<EvaluationDetail[]>([]);

  useEffect(() => {
    if (examId) fetchSubmissions();
  }, [examId]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/submissions?examId=${examId}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateSubmission = async (studentId: string) => {
    setEvaluatingId(studentId);
    try {
      await axios.post(`/api/submissions/evaluate/student`, { examId, studentId });
      alert("✅ Evaluation Complete!");
      fetchSubmissions();
    } catch (err) {
      console.error("Evaluation failed:", err);
      alert("Evaluation failed. Check server logs or AI API.");
    } finally {
      setEvaluatingId(null);
    }
  };

  const handleViewResult = async (submission: Submission) => {
    setSelectedSubmission(submission);
    try {
      // Fetch evaluation details if not already available
      if (!submission.evaluation_report?.evaluation_details) {
        const res = await axios.get(`/api/exam-results/${submission._id}`);
        const { submission: subData, examResult } = res.data;
        const merged = examResult.evaluationDetails.map((q: any, i: number) => ({
          ...q,
          studentAnswer: subData.answers[i]?.studentAnswer || "",
        }));
        setEditingReport(merged);
      } else {
        setEditingReport(submission.evaluation_report.evaluation_details || []);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch result");
    }
  };

  if (loading)
    return <div className="p-10 text-center text-white">Loading submissions...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/faculty">
            <Button variant="ghost" className="bg-transparent border border-gray-700">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold">Exam Submissions ({examId})</h1>
        </div>
        <Button
          onClick={fetchSubmissions}
          variant="outline"
          className="bg-transparent border border-gray-700"
        >
          Refresh List
        </Button>
      </div>

      {/* Submissions Table */}
      <div className="bg-[#0b1220] border border-indigo-900 rounded-xl overflow-hidden shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-indigo-900/50 hover:bg-indigo-900/60">
              <TableHead className="w-[150px] text-white">Student ID</TableHead>
              <TableHead className="text-white">Submission Date</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white w-[150px]">Score</TableHead>
              <TableHead className="text-white w-[150px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => (
              <TableRow
                key={sub._id}
                className="border-gray-800 hover:bg-gray-800/50"
              >
                <TableCell className="font-medium">{sub.studentId}</TableCell>
                <TableCell>{new Date(sub.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      sub.status === "evaluated"
                        ? "bg-green-700 text-green-200"
                        : "bg-yellow-700 text-yellow-200"
                    }`}
                  >
                    {sub.status.toUpperCase().replace("_", " ")}
                  </span>
                </TableCell>
                <TableCell>
                  {sub.status === "evaluated" ? (
                    <span className="text-lg font-bold text-teal-400">
                      {sub.total_score} / {sub.max_score}
                    </span>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {sub.status === "evaluated" ? (
                    <Button
                      onClick={() => handleViewResult(sub)}
                      className="bg-indigo-600 hover:bg-indigo-500 w-full flex items-center justify-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> View Result
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEvaluateSubmission(sub.studentId)}
                      disabled={evaluatingId === sub.studentId}
                      className="bg-teal-600 hover:bg-teal-500 w-full flex items-center justify-center gap-1"
                    >
                      {evaluatingId === sub.studentId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <BarChart2 className="w-4 h-4" />
                      )}
                      Evaluate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {submissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  No submissions yet for this exam.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Evaluation Modal */}
      <Dialog
        open={!!selectedSubmission}
        onOpenChange={() => setSelectedSubmission(null)}
      >
        <DialogContent className="bg-gray-900 text-gray-100 max-w-4xl w-[90vw] sm:w-[80vw] lg:w-[60vw] max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle>
              Evaluation Report – Student: {selectedSubmission?.studentId}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {editingReport.map((q, idx) => (
              <div key={idx} className="border border-gray-700 rounded-lg p-4">
                <p className="font-semibold text-indigo-400">
                  Q{idx + 1}: {q.questionText}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <strong>Student Answer:</strong> {q.studentAnswer}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-400">Score</label>
                    <Input
                      type="number"
                      value={q.scoreObtained}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setEditingReport((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, scoreObtained: val } : item
                          )
                        );
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Max Marks</label>
                    <Input value={q.maximumScore} disabled />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-sm text-gray-400">Feedback</label>
                  <Textarea
                    value={q.feedback}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingReport((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, feedback: val } : item))
                      );
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button
              onClick={async () => {
                if (!selectedSubmission) return;
                try {
                  await axios.put(`/api/exam-results/${selectedSubmission._id}`, {
                    submissionId: selectedSubmission._id,
                    updatedReport: editingReport,
                  });
                  alert("✅ Updated successfully!");
                  fetchSubmissions();
                  setSelectedSubmission(null);
                } catch (err) {
                  console.error(err);
                  alert("Failed to save updates");
                }
              }}
              className="bg-green-600 hover:bg-green-500 w-full sm:w-auto"
            >
              Save Updates
            </Button>
            <Button
              onClick={() => setSelectedSubmission(null)}
              className="bg-gray-700 w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
