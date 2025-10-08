
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Clock } from "lucide-react";

// You must redefine your data types here or import them
type Question = { Q_ID: string; question: string; options?: string[]; };
type QuestionPaper = { MCQs?: Question[]; Theory?: Question[]; Coding?: Question[]; };
type Exam = { _id: string; title: string; subject: { name: string; code?: string }; duration: number; questions: QuestionPaper; }; // Simplified type for this page

const ExamTaker = () => {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const examId = params.id as string;

    const [exam, setExam] = useState<Exam | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const authUserId = user?.id || (typeof window !== 'undefined' ? sessionStorage.getItem('temp_exam_student_id') : null);
    // --- Data Fetching ---
    useEffect(() => {
        const fetchExam = async () => {
            if (!examId) return;
            try {
                const response = await axios.get(`/api/exams/${examId}`);
                const fetchedExam: Exam = response.data;
                setExam(fetchedExam);
                setTimeLeft(fetchedExam.duration * 60); // Initialize timer
            } catch (err) {
                setError("Failed to load exam. It might not exist or be published.");
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [examId]);

    // --- Submission Logic ---
    const handleExamSubmission = useCallback(async () => {
        console.log("Submission Attempt: Exam:", !!exam, "User ID:",  user?.id);
        if (!exam || !authUserId) {
            setError("Cannot submit, exam or user not found.");
            return;
        }
        try {
            const payload = {
                examId: exam._id,
                studentId: user?.id || authUserId,
                answers: answers,
            };
            await axios.post("/api/submit-exam", payload);
            
            // FEATURE 3: Student returns to the dashboard after FINISHING the exam
            alert("Exam submitted successfully!");
            window.close(); // Close the new tab/window after successful submission
            // Alternatively, redirect: router.push('/student/dashboard');

        } catch (err) {
            console.error("Submission failed:", err);
            setError("There was an error submitting your exam.");
        }
    }, [exam, user, answers , authUserId]);

    // --- Timer Logic ---
    useEffect(() => {
        if (!exam) return;
        
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleExamSubmission(); // Auto-submit when time is up
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [exam, handleExamSubmission]);


    // --- Other Handlers & Memos (Copied from old component) ---
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const allQuestions = useMemo(() => {
        if (!exam?.questions) return [];
        const { MCQs = [], Theory = [], Coding = [] } = exam.questions;
        return [
            ...MCQs.map((q) => ({ ...q, type: "MCQ" })),
            ...Theory.map((q) => ({ ...q, type: "Theory" })),
            ...Coding.map((q) => ({ ...q, type: "Coding" })),
        ];
    }, [exam]);


    // --- Render Logic ---

if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Exam...</div>;

// CHECK 1: If the user is authenticated via the hook OR we have a temp ID, proceed.
if (!user && !authUserId) { 
    // This happens if the user state hasn't loaded and no temp ID was set.
    return <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: You must be logged in to take this exam.
        <Button onClick={() => window.close()} className="mt-4 bg-gray-700 hover:bg-gray-600">Close Window</Button>
    </div>;
}
    if (error || !exam) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error || "Exam data is missing."}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900 text-white font-sans p-6 sm:p-10">
            <div className="max-w-5xl mx-auto space-y-6">
                <header className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-3xl shadow-2xl border border-gray-600">
                    
                    {/* 🚨 FEATURE 3: Red "Finish Exam" button, replacing "Back to Dashboard" */}
                    <Button 
                        onClick={handleExamSubmission} 
                        className="flex items-center gap-2 font-semibold rounded-full bg-red-600 border border-red-800 hover:bg-red-700 text-white shadow-xl px-5 py-3 order-3 sm:order-1 mt-4 sm:mt-0"
                    >
                        <UploadCloud className="w-4 h-4" /> Finish Exam
                    </Button>

                    <div className="text-center flex-1 mt-4 sm:mt-0 order-1 sm:order-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-400 drop-shadow-md">{exam.subject.name} Exam</h1>
                    </div>
                    <div className="flex items-center space-x-2 text-red-600 font-bold bg-gradient-to-r from-red-200 to-red-100 px-5 py-2 rounded-full shadow-md mt-4 sm:mt-0 order-2 sm:order-3">
                        <Clock className="w-5 h-5" />
                        <span className="text-red-800">{formatTime(timeLeft)}</span>
                    </div>
                </header>

                {/* Question Section (Copied from old component) */}
                <section className="space-y-8">
                    {allQuestions.map((q, index) => (
                        <Card key={q.Q_ID || index} className="p-8 rounded-3xl shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
                            <CardHeader className="p-0 mb-6"><CardTitle className="text-xl font-bold text-blue-300">Question {index + 1}</CardTitle></CardHeader>
                            <CardContent className="p-0 space-y-6">
                                <p className="text-lg font-medium text-white">{q.question}</p>
                                {q.type === 'MCQ' && q.options && (
                                    // ... MCQ rendering logic ...
                                    <div className="space-y-4">
                                         {q.options.map((option, optIndex) => (
                                             <div key={optIndex} className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-blue-700">
                                                 <input type="radio" id={`${q.Q_ID}-opt${optIndex}`} name={q.Q_ID} value={option} onChange={(e) => handleAnswerChange(q.Q_ID, e.target.value)} className="form-radio text-blue-500 w-4 h-4" />
                                                 <label htmlFor={`${q.Q_ID}-opt${optIndex}`} className="text-white font-medium flex-1 cursor-pointer">{option}</label>
                                             </div>
                                         ))}
                                    </div>
                                )}
                                {q.type === 'Theory' && (
                                    <textarea rows={8} placeholder="Write your detailed answer here..." onChange={(e) => handleAnswerChange(q.Q_ID, e.target.value)} className="w-full p-4 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-300" />
                                )}
                                {q.type === 'Coding' && (
                                    <textarea rows={12} placeholder="// Write your code here..." onChange={(e) => handleAnswerChange(q.Q_ID, e.target.value)} className="w-full font-mono p-4 border border-gray-600 rounded-lg bg-gray-950 text-green-400 placeholder-gray-400" />
                                )}
                            </CardContent>
                        </Card>
                    ))}
                    
                    {/* Final Submission button consistent with the Finish Exam button */}
                    <Button 
                        onClick={handleExamSubmission} 
                        className="w-full flex items-center justify-center gap-3 py-4 text-white font-bold cursor-pointer rounded-3xl shadow-lg bg-gradient-to-r from-blue-800 to-blue-900 hover:to-blue-800"
                    >
                        <UploadCloud className="w-6 h-6" /> Submit Exam
                    </Button>
                </section>
            </div>
        </div>
    );
};

export default ExamTaker;