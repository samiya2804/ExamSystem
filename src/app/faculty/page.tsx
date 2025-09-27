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
import { FileText, Plus, BookOpen, CheckCircle, Save, Trash2, Check, Edit, X } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from 'axios';

type QuestionType = 'mcq' | 'short_answer' | 'long_answer' | 'coding';

// Updated types to match backend schema (_id)
type Question = {
  _id?: string;
  type: QuestionType;
  questionText: string;
  options?: string[];
};

// Added isPublished to the Exam type
type Exam = {
  _id: string;
  title: string;
  subject: string;
  durationInMinutes: number;
  date: string;
  questions: Question[];
  isPublished: boolean;
};

export default function FacultyPage() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [examTitle, setExamTitle] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [duration, setDuration] = useState(180);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>('mcq');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [publishedExams, setPublishedExams] = useState<Exam[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [examToAddToDashboard, setExamToAddToDashboard] = useState<Exam | null>(null);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  useEffect(() => {
    setSubjects(["Java", "DBMS", "Data Structures", "Operating Systems", "Python", "Computer Networks"]);
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get('/api/exams');
      setPublishedExams(response.data);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
      setMessage("❌ Failed to load exams. Please try again.");
    }
  };

  const handleAddQuestion = () => {
    if (!questionText || (questionType === 'mcq' && options.some(opt => !opt))) {
      setMessage("⚠️ Please fill in all question fields.");
      return;
    }
    const newQuestion: Question = {
      _id: `temp-${Date.now()}`, 
      type: questionType,
      questionText: questionText,
      options: questionType === 'mcq' ? options : undefined,
    };
    setCurrentQuestions([...currentQuestions, newQuestion]);
    setMessage("✅ Question added successfully!");
    setQuestionText("");
    setQuestionType("mcq");
    setOptions(['', '', '', '']);
  };

  const handleRemoveQuestion = (questionId: string | undefined) => {
    setCurrentQuestions(prevQuestions => prevQuestions.filter(q => q._id !== questionId));
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setExamTitle(exam.title);
    setSelectedSubject(exam.subject);
    setDuration(exam.durationInMinutes);
    setCurrentQuestions(exam.questions);
    setMessage(`✏️ Editing exam: ${exam.title}`);
  };

  const handleCancelEdit = () => {
    setEditingExam(null);
    setExamTitle("");
    setSelectedSubject("");
    setDuration(180);
    setCurrentQuestions([]);
    setMessage("Editing cancelled.");
  };

  const handleSaveExam = async () => {
    if (!examTitle || !selectedSubject) {
      setMessage("⚠️ Please provide an exam title and subject.");
      return;
    }

    try {
      const examData = {
        title: examTitle,
        subject: selectedSubject,
        duration: duration,
        questions: currentQuestions.map(q => ({
          type: q.type,
          questionText: q.questionText,
          options: q.options
        }))
      };

      if (editingExam) {
        // Update an existing exam
        const response = await axios.put(`/api/exams/${editingExam._id}`, examData);
        setPublishedExams(prevExams => prevExams.map(exam => exam._id === response.data._id ? response.data : exam));
        setMessage("📢 Exam updated successfully!");
        setEditingExam(null);
      } else {
        // Create a new exam
        const response = await axios.post('/api/exams', examData);
        setPublishedExams([response.data, ...publishedExams]);
        setMessage("📢 Exam published successfully!");
      }

      // Reset the form
      setExamTitle("");
      setSelectedSubject("");
      setDuration(180);
      setCurrentQuestions([]);
    } catch (error) {
      console.error("Error saving exam:", error);
      setMessage("❌ Failed to save exam. Please try again.");
    }
  };

  const handlePromptAddToDashboard = (exam: Exam) => {
    setExamToAddToDashboard(exam);
    setShowConfirmationModal(true);
  };

  const handleConfirmAddToDashboard = async () => {
    if (!examToAddToDashboard) return;
    try {
      const response = await axios.put(`/api/exams/${examToAddToDashboard._id}`, { isPublished: true });
      setPublishedExams(prevExams => prevExams.map(exam => exam._id === response.data._id ? response.data : exam));
      setMessage(`✅ Exam "${examToAddToDashboard.title}" added to student dashboard!`);
      setExamToAddToDashboard(null);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Failed to add to dashboard:", error);
      setMessage("❌ Failed to add exam to dashboard. Please try again.");
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (window.confirm("Are you sure you want to delete this exam? This action cannot be undone.")) {
      try {
        await axios.delete(`/api/exams/${examId}`);
        setPublishedExams(prevExams => prevExams.filter(exam => exam._id !== examId));
        setMessage("🗑️ Exam deleted successfully!");
      } catch (error) {
        console.error("Failed to delete exam:", error);
        setMessage("❌ Failed to delete exam. Please try again.");
      }
    }
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
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 p-4 bg-gray-900 text-white rounded-xl shadow-xl z-50 flex items-center gap-3"
        >
          <CheckCircle className="text-blue-400 w-6 h-6" />
          <span>{message}</span>
          <Button onClick={handleCloseMessage} variant="ghost" className="p-1 h-auto text-gray-400 hover:text-white">
            ✕
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
          className="fixed inset-0 bg-gray-950 bg-opacity-80 flex items-center justify-center z-40 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl text-center max-w-sm w-full space-y-6"
          >
            <h3 className="text-xl font-bold">Confirm Publish</h3>
            <p className="text-gray-300">Do you want to add this paper to the student dashboard?</p>
            <div className="flex justify-center gap-4">
              <Button onClick={handleConfirmAddToDashboard} className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6 py-3">Yes</Button>
              <Button onClick={handleCancelAddToDashboard} className="bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-full px-6 py-3">No</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-6 sm:p-10">
      <MessageToast />
      <ConfirmationModal />
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="p-8 bg-gradient-to-br from-indigo-900 to-gray-900 text-white rounded-3xl shadow-lg">
          <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
          <p className="text-sm opacity-90 mt-1">Create and manage question papers for your students.</p>
        </header>

        {/* Exam Creation Form */}
        <Card className="max-w-4xl mx-auto p-8 shadow-lg rounded-3xl bg-gray-900 border border-gray-700">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
              <FileText className="w-6 h-6 text-cyan-400" /> {editingExam ? "Edit Exam" : "Create New Exam"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-semibold mb-1 block text-gray-300">Exam Title</label>
                <Input type="text" placeholder="e.g., Mid-Term Exam" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} className="w-full rounded-xl p-3 bg-gray-800 border border-gray-700 text-white placeholder:text-white focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="font-semibold mb-1 block text-gray-300">Select Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full rounded-xl p-3 bg-gray-800 border border-gray-700 text-white placeholder:text-white">
                    <SelectValue placeholder="Choose a subject" className="placeholder:text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white placeholder:text-white">
                    {subjects.map((subj, idx) => (
                      <SelectItem key={idx} value={subj} className="hover:bg-blue-600">{subj}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="font-semibold mb-1 block text-gray-300">Duration (minutes)</label>
              <Input type="number" min={1} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full rounded-xl p-3 bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 placeholder:text-white" />
            </div>

            {/* Question Builder */}
            <div className="border border-gray-700 p-6 rounded-2xl space-y-6 bg-gray-800">
              <h3 className="text-xl font-bold text-white">Add Questions</h3>
              <div>
                <label className="font-semibold mb-1 block text-gray-300">Question Type</label>
                <Select value={questionType} onValueChange={(value) => setQuestionType(value as QuestionType)}>
                  <SelectTrigger className="w-full rounded-xl p-3 bg-gray-700 text-white">
                    <SelectValue placeholder="Choose question type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white">
                    <SelectItem value="mcq">Multiple Choice Question</SelectItem>
                    <SelectItem value="short_answer">Short Answer</SelectItem>
                    <SelectItem value="long_answer">Long Answer</SelectItem>
                    <SelectItem value="coding">Coding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-semibold mb-1 block text-gray-300">Question Text</label>
                <Textarea placeholder="Enter the question here..." value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="w-full rounded-xl p-3 bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 placeholder:text-white" />
              </div>

              {questionType === 'mcq' && (
                <div className="space-y-4">
                  <label className="font-semibold mb-1 block text-gray-300">Options</label>
                  {options.map((opt, idx) => (
                    <Input key={idx} type="text" placeholder={`Option ${idx + 1}`} value={opt} onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[idx] = e.target.value;
                      setOptions(newOptions);
                    }} className="w-full rounded-xl p-3 bg-gray-800 border border-gray-700 text-gray-100 placeholder:text-white focus:ring-2 focus:ring-teal-500" />
                  ))}
                </div>
              )}

              <Button onClick={handleAddQuestion} className="w-full bg-gradient-to-br from-indigo-900 to-gray-900 text-white rounded-xl shadow-md py-3 font-semibold hover:scale-105 transition">
                <Plus className="w-5 h-5" /> Add Question
              </Button>
            </div>

            {/* Current Questions */}
            {currentQuestions.length > 0 && (
              <div className="space-y-4 p-4 border border-gray-700 rounded-2xl bg-gray-800">
                <h4 className="text-lg font-bold text-white">Questions ({currentQuestions.length})</h4>
                <ul className="space-y-2 text-gray-300">
                  {currentQuestions.map((q) => (
                    <li key={q._id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                      <span>
                        <span className="font-medium text-blue-400">{q.type.toUpperCase()}</span>: {q.questionText.slice(0, 50)}...
                      </span>
                      <Button onClick={() => handleRemoveQuestion(q._id)} variant="ghost" className="p-1 h-auto text-gray-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4">
              {editingExam && (
                <Button onClick={handleCancelEdit} className="w-1/2 py-4 text-lg font-bold bg-gray-700 text-white rounded-xl shadow-md hover:bg-gray-600 transition">
                  Cancel Edit
                </Button>
              )}
              <Button onClick={handleSaveExam} className={`w-${editingExam ? '1/2' : 'full'} py-4 text-lg font-bold bg-blue-900 text-white rounded-xl shadow-md hover:bg-blue-950 transition`}>
                <Save className="w-5 h-5 mr-2" /> {editingExam ? "Save Changes" : "Create & Publish Exam"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Published Exams */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-white mb-6">Published Exams</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedExams.map((exam) => (
              <Card key={exam._id} className="relative rounded-2xl shadow-md p-6 bg-gray-800 border border-gray-700 hover:scale-105 transition">
                <CardHeader className="p-0 mb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold text-white">{exam.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditExam(exam)}
                        className="text-blue-500 cursor-pointer p-2 rounded-full"
                        variant="ghost"
                        size="sm"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteExam(exam._id)}
                        className="text-red-500 hover:text-red-600 p-2 rounded-full"
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <BookOpen className="w-4 h-4 text-cyan-400" /> {exam.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-2 text-gray-300">
                  <p>Duration: {exam.durationInMinutes} minutes</p>
                  <p>Questions: {exam.questions.length}</p>
                  <p>Date: {new Date(exam.date).toLocaleDateString()}</p>
                  {exam.isPublished ? (
                    <Button className="w-full mt-4 bg-green-700 text-white rounded-xl shadow-md py-3 font-semibold hover:bg-green-800 cursor-not-allowed">
                      <Check className="w-5 h-5 mr-2" /> Added
                    </Button>
                  ) : (
                    <Button onClick={() => handlePromptAddToDashboard(exam)} className="w-full mt-4 bg-blue-700 text-white hover:bg-blue-900 rounded-xl cursor-pointer shadow-md py-3 font-semibold hover:scale-105 transition">
                      Add to Dashboard
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}