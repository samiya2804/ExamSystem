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
  ChevronLeft,
  CheckCircle,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
const Link = ({ href, children, target, passHref, className }: { href: string; children: React.ReactNode; target?: string; passHref?: boolean; className?: string }) => <a href={href} target={target} className={className}>{children}</a>;
import { useAuth } from "@/lib/hooks/useAuth";
import axios from "axios";


// --- DATA TYPES (CORRECTED & FINAL) ---

type Question = {
  Q_ID: string;
  question: string;
  options?: string[];
};

// FIX 1: This now correctly represents the nested question object from your API
type QuestionPaper = {
  MCQs?: Question[];
  Theory?: Question[];
  Coding?: Question[];
};

// FIX 2: This type now matches your Mongoose schema and API response
type Exam = {
  _id: string;
  title: string;
  subject: { name: string; code?: string }; // subject is an object
  duration: number; // The property is `duration`, not `durationInMinutes`
  date: string;
  questions: QuestionPaper; // questions is an object
  isPublished: boolean;
   publishedAt?: string; 
};

// FIX 3: This type now matches the result from your evaluation API and DB schema
type EvaluationDetail = {
  question_id: string;
  question_type: string;
  evaluation?: Record<string, any>;
  error?: string;
};

type Result = {
  _id: string;
  subject: { name: string; code?: string }; // Result should also contain subject info
  student_id: string;
  total_score: number;
  max_score: number;
  evaluation_details: EvaluationDetail[];
};

// --- MAIN COMPONENT ---
export default function StudentDashboard() {
  const { user } = useAuth();
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [pastResults, setPastResults] = useState<Result[]>([]);
   const [activeExam, setActiveExam] = useState<Exam | null>(null);

  const [timeLeft, setTimeLeft] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finishedExams, setFinishedExams] = useState<Set<string>>(new Set()); 
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return; // Don't fetch if user is not loaded
      setLoading(true);
      try {
        const examsResponse = await axios.get("/api/exams");
        const publishedExams = examsResponse.data.filter(
          (exam: Exam) => exam.isPublished
        );
        setAvailableExams(publishedExams);

        // FIX 4: Uncommented to fetch real results
        const resultsResponse = await axios.get(`/api/results?studentId=${user.id}`);
        setPastResults(resultsResponse.data);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);



  const averageMarksData = useMemo(() => {
    return pastResults.map((res) => ({
      subject: res.subject?.name || 'Exam',
      marks: res.max_score > 0 ? (res.total_score / res.max_score) * 100 : 0,
    }));
  }, [pastResults]);
  
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
          <Button onClick={handleCloseMessage} variant="ghost" className="p-1 h-auto text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p>Loading dashboard...</p></div>;
  if (error) 
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-red-500">Error: {error}</p></div>;

  if (!activeExam) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100 font-sans p-6 sm:p-10">
        <MessageToast />
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <header className="p-8 bg-gradient-to-br from-indigo-900 to-gray-900 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center shadow-inner"><span className="text-3xl font-bold text-blue-900">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span></div>
              <div><h1 className="text-3xl font-bold">Welcome, {user?.firstName}</h1><p className="text-sm opacity-90 mt-1">Ready for your next challenge?</p></div>
            </div>
<<<<<<< Updated upstream
            <div className="mt-4 sm:mt-0"><Link href="/student/results"><Button className="bg-white text-teal-600 hover:bg-teal-50 font-semibold transition-transform duration-200 transform hover:scale-105 rounded-full px-6 py-3 shadow">View All Results</Button></Link></div>
          </header>
=======
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user?.firstName}</h1>
              <p className="text-sm opacity-90 mt-1">
                Ready for your next challenge?
              </p>
            </div>
          </div>
       <div className="flex">
            <div className="mt-4 sm:mt-0"><Link href="/student/results">
            <Button className="bg-white text-blue-600 hover:bg-teal-50 font-semibold transition-transform duration-200 transform hover:scale-105 rounded-full px-6 py-3 shadow">View Results</Button>
            
            </Link>
            </div>
               <div className="mt-4 sm:mt-0 ml-4"><Link href="/student/analytics">
            <Button className="bg-white text-blue-600 hover:bg-teal-50 font-semibold transition-transform duration-200 transform hover:scale-105 rounded-full px-6 py-3 shadow">View Analytics</Button>
            </Link>
          </div>
          </div>
        </header>
>>>>>>> Stashed changes

          {/* Key Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700"><CardHeader className="p-0 pb-3"><CardTitle className="text-xl font-semibold text-white flex items-center space-x-2"><BookOpen className="w-6 h-6 text-white" /><span>Exams Available</span></CardTitle></CardHeader><CardContent className="p-0"><div className="text-5xl font-extrabold text-teal-600 mt-2">{availableExams.length}</div><p className="text-sm text-white mt-2">Upcoming tests on your schedule.</p></CardContent></Card>
            <Card className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700"><CardHeader className="p-0 pb-3"><CardTitle className="text-xl font-semibold text-white flex items-center space-x-2"><BarChart2 className="w-6 h-6 text-green-500" /><span>Average Score</span></CardTitle></CardHeader><CardContent className="p-0"><div className="text-5xl font-extrabold text-green-600 mt-2">{pastResults.length > 0 ? `${(pastResults.reduce((sum, res) => sum + (res.max_score > 0 ? res.total_score / res.max_score : 0), 0) / pastResults.length * 100).toFixed(0)}%`: "N/A"}</div><p className="text-sm text-white mt-2">Your average performance.</p></CardContent></Card>
            <Card className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700"><CardHeader className="p-0 pb-3"><CardTitle className="text-xl font-semibold text-white flex items-center space-x-2"><FileText className="w-6 h-6 text-yellow-500" /><span>Exams Completed</span></CardTitle></CardHeader><CardContent className="p-0"><div className="text-5xl font-extrabold text-yellow-600 mt-2">{pastResults.length}</div><p className="text-sm text-white mt-2">Exams you have completed.</p></CardContent></Card>
            <Card className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700"><CardHeader className="p-0 pb-3"><CardTitle className="text-xl font-semibold text-white flex items-center space-x-2"><Calendar className="w-6 h-6 text-blue-500" /><span>Last Exam</span></CardTitle></CardHeader><CardContent className="p-0"><div className="text-4xl font-bold text-blue-600 mt-2 mb-4">{pastResults.length > 0 ? pastResults[pastResults.length - 1].subject?.name : "None"}</div><p className="text-sm text-white mt-2">Most recent subject completed.</p></CardContent></Card>
          </section>

          {/* Upcoming Exams */}
          <section>
            <h2 className="text-3xl font-bold text-blue-600 mb-6">Upcoming Exams</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableExams.map((exam) => {
                 const hasFinished = finishedExams.has(exam._id);
                  const isReady = 
                  (exam.questions && 
                    ((exam.questions.MCQs?.length ?? 0) > 0 || 
                    (exam.questions.Theory?.length ?? 0) > 0));
                
                // FEATURE 2: Use publishedAt date
                const displayDate = exam.publishedAt 
                    ? new Date(exam.publishedAt).toLocaleDateString() 
                    : new Date(exam.date).toLocaleDateString();

                    return(

                <Card key={exam._id} className="rounded-2xl shadow-lg p-6 bg-slate-800 border border-slate-700 flex flex-col justify-between">
                  <CardHeader className="p-0"><CardTitle className="text-2xl font-semibold text-blue-800 flex items-center gap-3"><BookOpen className="w-7 h-7" /> {exam.subject.name}</CardTitle></CardHeader>
                  <CardContent className="p-0 mt-4 flex-grow space-y-2 text-white">
                    <div className="flex items-center gap-2"><FileText className="w-4 h-4" /><span>Duration: {exam.duration} Minutes</span></div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>Published: {displayDate}</span></div>
                  </CardContent>
                  {/* FIX 5: This is the corrected conditional check */}
                  {(exam.questions && ((exam.questions.MCQs?.length ?? 0) > 0 || (exam.questions.Theory?.length ?? 0) > 0)) ? (
<Button 
    onClick={() => {
        // --- ADDED AUTH STATE TRANSFER ---
        if (user?.id) {
            // Save a flag or ID to session storage so the new window can quickly verify
            sessionStorage.setItem('temp_exam_student_id', user.id);
        }
        // --- END ADDED AUTH STATE TRANSFER ---
        
        window.open(`/student/exam/${exam._id}`, "_blank");
    }} 
    className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl"
>
                      <UploadCloud className="w-5 h-5" /> Start Exam</Button>
                  ) : (
                    <div 
                    className="w-full mt-6 text-center text-gray-400 text-sm">
                      Questions not yet available.</div>
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
}

  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900 text-white font-sans p-6 sm:p-10">
  //     <MessageToast />
  //     <div className="max-w-5xl mx-auto space-y-6">
  //       <header className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-3xl shadow-2xl border border-gray-600">
  //         <Button onClick={() => setActiveExam(null)} className="flex items-center gap-2 text-blue-400 font-semibold rounded-full bg-gray-800 border border-gray-600 hover:bg-blue-900 hover:text-white"><ChevronLeft className="w-4 h-4" /> Back to Dashboard</Button>
  //         <div className="text-center flex-1 mt-4 sm:mt-0"><h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-400 drop-shadow-md">{activeExam.subject.name} Exam</h1></div>
  //         <div className="flex items-center space-x-2 text-red-600 font-bold bg-gradient-to-r from-red-200 to-red-100 px-5 py-2 rounded-full shadow-md mt-4 sm:mt-0"><Clock className="w-5 h-5" /><span className="text-red-800">{formatTime(timeLeft)}</span></div>
  //       </header>

  //       <section className="space-y-8">
  //         {allQuestions.map((q, index) => (
  //           <Card key={q.Q_ID || index} className="p-8 rounded-3xl shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
  //             <CardHeader className="p-0 mb-6"><CardTitle className="text-xl font-bold text-blue-300">Question {index + 1}</CardTitle></CardHeader>
  //             <CardContent className="p-0 space-y-6">
  //               <p className="text-lg font-medium text-white">{q.question}</p>
  //               {q.type === 'MCQ' && q.options && (
  //                 <div className="space-y-4">
  //                   {q.options.map((option, optIndex) => (
  //                     <div key={optIndex} className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-blue-700">
  //                       <input type="radio" id={`${q.Q_ID}-opt${optIndex}`} name={q.Q_ID} value={option} onChange={(e) => handleAnswerChange(q.Q_ID, e.target.value)} className="form-radio text-blue-500 w-4 h-4" />
  //                       <label htmlFor={`${q.Q_ID}-opt${optIndex}`} className="text-white font-medium flex-1 cursor-pointer">{option}</label>
  //                     </div>
  //                   ))}
  //                 </div>
  //               )}
  //               {q.type === 'Theory' && (
  //                 <textarea rows={8} placeholder="Write your detailed answer here..." onChange={(e) => handleAnswerChange(q.Q_ID, e.target.value)} className="w-full p-4 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-300" />
  //               )}
  //               {q.type === 'Coding' && (
  //                 <textarea rows={12} placeholder="// Write your code here..." onChange={(e) => handleAnswerChange(q.Q_ID, e.target.value)} className="w-full font-mono p-4 border border-gray-600 rounded-lg bg-gray-950 text-green-400 placeholder-gray-400" />
  //               )}
  //             </CardContent>
  //           </Card>
  //         ))}
  //         { /* FIX 6: Removed the duplicate and incorrect mapping loop that was here */ }
  //         <Button onClick={handleExamSubmission} className="w-full flex items-center justify-center gap-3 py-4 text-white font-bold rounded-3xl shadow-lg bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 hover:from-blue-500 hover:to-blue-800">
  //           <UploadCloud className="w-6 h-6" /> Submit Exam
  //         </Button>
  //       </section>
  //     </div>
  //   </div>
  // );
// }

