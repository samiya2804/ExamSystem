"use client";

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FileText, Plus, BookOpen, CheckCircle, Save, Calendar, Link } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// --- DATA TYPES ---
// These types reflect the new, more detailed structure needed for the student dashboard.
type QuestionType = 'mcq' | 'short_answer' | 'long_answer' | 'coding';

type Question = {
  id: string;
  type: QuestionType;
  questionText: string;
  options?: string[]; // Only for MCQs
};

type Exam = {
  id: string;
  title: string;
  subject: string;
  durationInMinutes: number;
  date: string;
  questions: Question[];
};

// --- MAIN COMPONENT ---
export default function FacultyPage() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [examTitle, setExamTitle] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [duration, setDuration] = useState(180); // In minutes
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>('mcq');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);

  // This state will hold all questions for the current exam being created.
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  
  // This state will hold a list of all exams published by the faculty.
  const [publishedExams, setPublishedExams] = useState<Exam[]>([]);

  const [message, setMessage] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [examToAddToDashboard, setExamToAddToDashboard] = useState<Exam | null>(null);

  useEffect(() => {
    // Simulate fetching subjects from a backend
    setSubjects(["Java", "DBMS", "Data Structures", "Operating Systems" , "Python" , "Computer Networks"]);
  }, []);

  const handleAddQuestion = () => {
    if (!questionText || (questionType === 'mcq' && options.some(opt => !opt))) {
      setMessage("Please fill in all question fields.");
      return;
    }
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: questionType,
      questionText: questionText,
      options: questionType === 'mcq' ? options : undefined,
    };

    setCurrentQuestions([...currentQuestions, newQuestion]);
    setMessage("Question added successfully!");

    // Reset question form
    setQuestionText("");
    setQuestionType("mcq");
    setOptions(['', '', '', '']);
  };

  const handleCreateExam = () => {
    if (!examTitle || !selectedSubject || currentQuestions.length === 0) {
      setMessage("Please provide an exam title, subject, and at least one question.");
      return;
    }

    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      title: examTitle,
      subject: selectedSubject,
      durationInMinutes: duration,
      date: new Date().toISOString().split('T')[0], // Today's date
      questions: currentQuestions,
    };

    setPublishedExams([newExam, ...publishedExams]);
    setMessage("Exam published successfully! It's now in your published list.");

    // Reset the exam creation form
    setExamTitle("");
    setSelectedSubject("");
    setDuration(180);
    setCurrentQuestions([]);
  };

  const handlePromptAddToDashboard = (exam: Exam) => {
    setExamToAddToDashboard(exam);
    setShowConfirmationModal(true);
  };
  
  const handleConfirmAddToDashboard = () => {
    // In a real application, you would send this 'examToAddToDashboard' object to your backend API.
    setMessage(`Exam "${examToAddToDashboard?.title}" successfully added to student dashboard!`);
    
    // Clear the confirmation state
    setExamToAddToDashboard(null);
    setShowConfirmationModal(false);
  };

  const handleCancelAddToDashboard = () => {
    setExamToAddToDashboard(null);
    setShowConfirmationModal(false);
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  const MessageToast = () => (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 p-4 bg-gray-800 text-white rounded-xl shadow-xl z-50 flex items-center gap-3"
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

  const ConfirmationModal = () => (
    <AnimatePresence>
      {showConfirmationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-40 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm w-full space-y-6"
          >
            <h3 className="text-xl font-bold text-gray-800">Confirm Publish</h3>
            <p className="text-gray-600">Do you want to add this paper to the student dashboard?</p>
            <div className="flex justify-center gap-4">
              <Button onClick={handleConfirmAddToDashboard} className="bg-green-600 text-white hover:bg-green-700 rounded-full font-semibold px-6 py-3 transition-transform duration-200 transform hover:scale-105">Yes</Button>
              <Button onClick={handleCancelAddToDashboard} className="bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-full font-semibold px-6 py-3 transition-transform duration-200 transform hover:scale-105">No</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-6 sm:p-10">
      <MessageToast />
      <ConfirmationModal />
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="p-8 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-3xl shadow-xl">
          <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
          <p className="text-sm opacity-90 mt-1">Create and manage question papers for your students.</p>
        </header>

        {/* Exam Creation Form */}
        <Card className="max-w-4xl mx-auto p-8 shadow-lg border rounded-3xl bg-white">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-2xl font-bold flex items-center gap-2 text-gray-800">
              <FileText className="w-6 h-6 text-cyan-600" /> Create New Exam
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-semibold mb-1 block text-gray-700">Exam Title</label>
                <Input type="text" placeholder="e.g., Mid-Term Exam" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} className="w-full rounded-xl p-3 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none transition" />
              </div>
              <div>
                <label className="font-semibold mb-1 block text-gray-700">Select Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full rounded-xl p-3 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none transition">
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subj, idx) => (
                      <SelectItem key={idx} value={subj}>
                        {subj}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="font-semibold mb-1 block text-gray-700">Duration (in minutes)</label>
              <Input type="number" min={1} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full rounded-xl p-3 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none transition" />
            </div>

            {/* Question Creation Section */}
            <div className="border border-gray-200 p-6 rounded-2xl space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Add Questions</h3>
              <div>
                <label className="font-semibold mb-1 block text-gray-700">Question Type</label>
                <Select value={questionType} onValueChange={(value) => setQuestionType(value as QuestionType)}>
                  <SelectTrigger className="w-full rounded-xl p-3 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none transition">
                    <SelectValue placeholder="Choose question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">Multiple Choice Question (MCQ)</SelectItem>
                    <SelectItem value="short_answer">Short Answer</SelectItem>
                    <SelectItem value="long_answer">Long Answer</SelectItem>
                    <SelectItem value="coding">Coding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-semibold mb-1 block text-gray-700">Question Text</label>
                <Textarea placeholder="Enter the question here..." value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="w-full rounded-xl p-3 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none transition" />
              </div>

              {questionType === 'mcq' && (
                <div className="space-y-4">
                  <label className="font-semibold mb-1 block text-gray-700">Options</label>
                  {options.map((opt, idx) => (
                    <Input key={idx} type="text" placeholder={`Option ${idx + 1}`} value={opt} onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[idx] = e.target.value;
                      setOptions(newOptions);
                    }} className="w-full rounded-xl p-3 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none transition" />
                  ))}
                </div>
              )}
              <Button onClick={handleAddQuestion} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white cursor-pointer rounded-xl shadow-md py-3 font-semibold transition-transform duration-200 transform hover:scale-105">
                <Plus className="w-5 h-5" /> Add Question to Exam
              </Button>
            </div>
            
            {/* List of current questions */}
            {currentQuestions.length > 0 && (
              <div className="space-y-4 p-4 border border-gray-200 rounded-2xl bg-gray-50">
                <h4 className="text-lg font-bold text-gray-800">Questions in this Exam ({currentQuestions.length})</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-600">
                  {currentQuestions.map((q, index) => (
                    <li key={q.id}>
                      <span className="font-medium">{q.type.replace('_', ' ').toUpperCase()}</span>: {q.questionText.slice(0, 50)}...
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <Button onClick={handleCreateExam} className="w-full py-4 text-lg font-bold bg-teal-600 text-white hover:bg-teal-700 rounded-xl shadow-md transition-transform duration-200 transform hover:scale-105">
              <Save className="w-5 h-5 mr-2"/> Create and Publish Exam
            </Button>
          </CardContent>
        </Card>

        {/* Published Exams Section */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Published Exams</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedExams.map((exam) => (
              <Card key={exam.id} className="rounded-2xl shadow-md p-6 bg-white transform transition-transform hover:scale-105">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">{exam.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <BookOpen className="w-4 h-4" /> {exam.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-2">
                  <p className="text-sm text-gray-600">Duration: {exam.durationInMinutes} minutes</p>
                  <p className="text-sm text-gray-600">Questions: {exam.questions.length}</p>
                  <p className="text-sm text-gray-600">Date Published: {exam.date}</p>
                  <Button onClick={() => handlePromptAddToDashboard(exam)} className="w-full flex items-center justify-center gap-2 mt-4 bg-teal-600 text-white hover:bg-teal-700 rounded-lg shadow-md py-3 font-semibold transition-transform duration-200 transform hover:scale-105">
                    Add to Dashboard
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
