// faculty/results/[examId]/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, BarChart2, CheckCircle } from "lucide-react";

// Simplified types based on the Submission model
type Submission = {
    _id: string;
    studentId: string;
    status: 'pending_evaluation' | 'evaluated';
    total_score: number;
    max_score: number;
    evaluation_report: any; // Full JSON report
    createdAt: string;
};

export default function ExamResultsPage() {
    const params = useParams();
    const examId = params.examId as string;
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [evaluatingId, setEvaluatingId] = useState<string | null>(null);

    useEffect(() => {
        if (examId) {
            fetchSubmissions();
        }
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

    const handleEvaluateSubmission = async (submissionId: string) => {
        setEvaluatingId(submissionId);
        try {
            // Hitting the new Next.js API route (which acts as a proxy to FastAPI)
            const res = await axios.post(`/api/submissions/${submissionId}/evaluate`);
            
            alert("Evaluation Complete!");
            
            // Update the local state with the new score/report
            setSubmissions(prev => prev.map(sub => sub._id === submissionId ? res.data : sub));

        } catch (err) {
            console.error("Evaluation failed:", err);
            alert("Evaluation failed. Check API key or FastAPI server.");
        } finally {
            setEvaluatingId(null);
        }
    };
    
    // Helper to extract question-level scores/feedback for detailed view (optional)
    const renderEvaluationDetails = (report: any) => {
        if (!report?.evaluation_details) return "N/A";
        return report.evaluation_details.map((q: any) => {
            const feedback = q.evaluation?.feedback || 'No feedback';
            return (
                <div key={q.question_id} className="text-xs text-gray-400 border-t border-gray-700 pt-1 mt-1">
                    <strong>{q.question_id}:</strong> {feedback} ({q.evaluation?.score_obtained}/{q.evaluation?.maximum_score})
                </div>
            );
        });
    };

    if (loading) return <div className="p-10 text-center text-white">Loading submissions...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/faculty">
                        <Button variant="ghost" className="bg-transparent border border-gray-700"><ArrowLeft className="w-4 h-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Exam Submissions ({examId})</h1>
                </div>
                <Button onClick={fetchSubmissions} variant="outline" className="bg-transparent border border-gray-700">
                    Refresh List
                </Button>
            </div>

            <div className="bg-[#0b1220] border border-indigo-900 rounded-xl overflow-hidden shadow-md">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-indigo-900/50 hover:bg-indigo-900/60">
                            <TableHead className="w-[150px] text-white">Student ID</TableHead>
                            <TableHead className="text-white">Submission Date</TableHead>
                            <TableHead className="text-white">Status</TableHead>
                            <TableHead className="text-white w-[150px]">Score</TableHead>
                            <TableHead className="text-white w-[150px]">Action</TableHead>
                            <TableHead className="text-white">Evaluation Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submissions.map((sub) => (
                            <TableRow key={sub._id} className="border-gray-800 hover:bg-gray-800/50">
                                <TableCell className="font-medium">{sub.studentId}</TableCell>
                                <TableCell>{new Date(sub.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        sub.status === 'evaluated' ? 'bg-green-700 text-green-200' : 'bg-yellow-700 text-yellow-200'
                                    }`}>
                                        {sub.status.toUpperCase().replace('_', ' ')}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {sub.status === 'evaluated' ? (
                                        <span className="text-lg font-bold text-teal-400">
                                            {sub.total_score} / {sub.max_score}
                                        </span>
                                    ) : '—'}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => handleEvaluateSubmission(sub._id)}
                                        disabled={sub.status === 'evaluated' || evaluatingId === sub._id}
                                        className="bg-teal-600 hover:bg-teal-500"
                                    >
                                        {evaluatingId === sub._id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <BarChart2 className="w-4 h-4 mr-1" />
                                        )}
                                        {sub.status === 'evaluated' ? 'Re-Evaluate' : 'Evaluate'}
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    {sub.status === 'evaluated' && sub.evaluation_report ? (
                                        <div className="max-h-20 overflow-y-auto text-sm">
                                            {renderEvaluationDetails(sub.evaluation_report)}
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">Not yet evaluated</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {submissions.length === 0 && (
                            <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-8">No submissions yet for this exam.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}