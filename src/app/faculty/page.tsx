"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  BookOpen,
  Play,
  Eye,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/hooks/useAuth";

// --- DATA TYPES (CORRECTED) ---

type Subject = { _id: string; name: string; code?: string };

// This defines the structure of the generated questions object
type QuestionPaper = {
  MCQs?: { question: string; options?: string[] }[];
  Theory?: { question: string }[];
  Coding?: { question: string }[];
};

// FIX 1: Replaced `any` with a specific and accurate type for Exams
type Exam = {
  _id: string;
  title: string;
  course: string;
  subject: Subject;
  duration: number;
  status: string;
  questions: QuestionPaper;
  veryShort: { count: number; difficulty: string };
  short: { count: number; difficulty: string };
  long: { count: number; difficulty: string };
  coding: { count: number };
  instructions: string;
};

export default function FacultyDashboardPage() {
  const { user } = useAuth();
  const facultyId = user?.id;
  const facultyName = user?.firstName;

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loadingExams, setLoadingExams] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [form, setForm] = useState({
    title: "", course: "B.Tech", subjectId: "", duration: 180,
    veryShortCount: 5, veryShortDifficulty: "easy",
    shortCount: 5, shortDifficulty: "medium",
    longCount: 2, longDifficulty: "hard",
    codingCount: 0, instructions: "",
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);

  // FIX 2: Load exams only AFTER the facultyId is available from the auth hook
  useEffect(() => {
    async function loadInitialData() {
        await fetchSubjects();
        if (facultyId) {
            await loadExams(facultyId);
        }
    }
    loadInitialData();
  }, [facultyId]);

  async function fetchSubjects() {
    try {
      const res = await fetch("/api/subject");
      const data = await res.json();
      setSubjects(data || []);
    } catch (err) {
      console.error("Subjects fetch error", err);
    }
  }

  async function loadExams(id: string) {
    setLoadingExams(true);
    try {
      const res = await fetch(`/api/exams?facultyId=${id}`);
      const data = await res.json();
      setExams(data || []);
    } catch (err) {
      console.error("Failed loading exams", err);
    } finally {
      setLoadingExams(false);
    }
  }

  function openCreateModal() {
    setEditingExam(null);
    setForm({
      title: "", course: "B.Tech", subjectId: "", duration: 180,
      veryShortCount: 5, veryShortDifficulty: "easy",
      shortCount: 5, shortDifficulty: "medium",
      longCount: 2, longDifficulty: "hard",
      codingCount: 0, instructions: "",
    });
    setOpenModal(true);
  }

  function openEditModal(exam: Exam) {
    setEditingExam(exam);
    setForm({
      title: exam.title,
      course: exam.course || "B.Tech",
      subjectId: exam.subject?._id || "",
      duration: exam.duration || 180,
      veryShortCount: exam.veryShort?.count || 0,
      veryShortDifficulty: exam.veryShort?.difficulty || "easy",
      shortCount: exam.short?.count || 0,
      shortDifficulty: exam.short?.difficulty || "medium",
      longCount: exam.long?.count || 0,
      longDifficulty: exam.long?.difficulty || "hard",
      codingCount: exam.coding?.count || 0,
      instructions: exam.instructions || "",
    });
    setOpenModal(true);
  }

  const handleSaveExam = async () => {
    if (!form.title || !form.subjectId) {
      alert("Please provide exam title and select a subject.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title, course: form.course, subject: form.subjectId,
        duration: form.duration,
        veryShort: { count: Number(form.veryShortCount), difficulty: form.veryShortDifficulty },
        short: { count: Number(form.shortCount), difficulty: form.shortDifficulty },
        long: { count: Number(form.longCount), difficulty: form.longDifficulty },
        coding: { count: Number(form.codingCount || 0) },
        instructions: form.instructions, 
        facultyId: facultyId, // This is now guaranteed to exist when the form is submitted
      };

      const url = editingExam ? `/api/exams/${editingExam._id}` : "/api/exams";
      const method = editingExam ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const saved = await res.json();
      if (!res.ok) throw new Error(saved.error || "Failed to save exam");

      if (editingExam) {
        setExams((p) => p.map((e) => (e._id === saved._id ? saved : e)));
      } else {
        setExams((p) => [saved, ...p]);
      }
      setOpenModal(false);
    } catch (err: any) {
      console.error("Save exam error:", err);
      alert(`Failed to save exam: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePaper = async (examId: string) => {
    if (!confirm("Generate question paper using AI? This will replace existing questions.")) return;
    setGenerating(examId);
    try {
      const res = await fetch(`/api/exams/${examId}/generate`, { method: "POST" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Generation failed with an unknown error");
      }
      const updated = await res.json();
      setExams((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
      alert("Generation completed.");
    } catch (err: any) {
      console.error("Generation Error:", err);
      alert(`Failed to generate: ${err.message}`);
    } finally {
      setGenerating(null);
    }
  };

  const handlePublish = async (examId: string) => {
    if (!confirm("Publish this exam to students?")) return;
    try {
      const res = await fetch(`/api/exams/${examId}/publish`, { method: "PUT" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Publish failed");
      }
      const updated = await res.json();
      setExams((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
      alert("Exam published.");
    } catch (err: any) {
      console.error("Publish Error:", err);
      alert(`Publish done: ${err.message}`);
    }
  };

  const handleDelete = async (examId: string) => {
    if (!confirm("Delete this exam?")) return;
    try {
      const res = await fetch(`/api/exams/${examId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setExams((prev) => prev.filter((e) => e._id !== examId));
      alert("Exam deleted.");
    } catch (err: any) {
      console.error("Delete Error:", err);
      alert(`Delete failed: ${err.message}`);
    }
  };

  const countQuestions = (paper: QuestionPaper | null | undefined): number => {
    if (!paper) return 0;
    return (paper.MCQs?.length || 0) + (paper.Theory?.length || 0) + (paper.Coding?.length || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-black text-gray-100 p-6">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-800 to-indigo-600 p-8 shadow-xl mb-8">
        <h1 className="text-4xl font-bold">Faculty Dashboard</h1>
        <p className="mt-2 text-gray-200">Create and manage question papers for your students.</p>
        <p className="mt-4 text-lg">Faculty Name: <strong className="text-white">{facultyName}</strong></p>
      </div>

      <div className="bg-[#0b1220] border border-indigo-900 rounded-xl p-6 shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3"><BookOpen className="w-6 h-6 text-teal-300" /><h2 className="text-2xl font-semibold">Create New Exam</h2></div>
          <div><Button onClick={openCreateModal} className="bg-indigo-700 hover:bg-indigo-600"><PlusCircle className="w-4 h-4 mr-2" /> New Exam</Button></div>
        </div>
        <p className="text-gray-400">Quickly create an exam, generate questions automatically, preview, edit and publish.</p>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="bg-[#08101a] text-gray-100 rounded-lg w-full max-w-3xl">
          <DialogHeader><DialogTitle>{editingExam ? "Edit Exam" : "Create Exam"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-3 p-2">
              <label>Exam Title</label>
              <Input placeholder="e.g., Mid-Term Exam" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-transparent border-gray-700" />
              <label>Select Subject</label>
              <Select value={form.subjectId} onValueChange={(v) => setForm({ ...form, subjectId: v })}>
                <SelectTrigger className="bg-transparent border-gray-700"><SelectValue placeholder="Choose a subject" /></SelectTrigger>
                <SelectContent>{subjects.map((s) => (<SelectItem key={s._id} value={s._id}>{s.name} {s.code ? `(${s.code})` : ""}</SelectItem>))}</SelectContent>
              </Select>
              <label>Class / Course</label>
              <Input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className="bg-transparent border-gray-700" />
              <label>Duration (minutes)</label>
              <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} className="bg-transparent border-gray-700" />
            </div>
            <div className="p-2 space-y-3">
              <div><label>Very Short Questions (MCQ)</label><div className="flex gap-2 mt-1"><Input type="number" className="w-24 bg-transparent border-gray-700" value={form.veryShortCount} onChange={(e) => setForm({ ...form, veryShortCount: Number(e.target.value) })} /><Select value={form.veryShortDifficulty} onValueChange={(v) => setForm({ ...form, veryShortDifficulty: v })}><SelectTrigger className="bg-transparent border-gray-700 w-40"><SelectValue placeholder="Difficulty" /></SelectTrigger><SelectContent><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent></Select></div></div>
              <div><label>Short Questions (Theory)</label><div className="flex gap-2 mt-1"><Input type="number" className="w-24 bg-transparent border-gray-700" value={form.shortCount} onChange={(e) => setForm({ ...form, shortCount: Number(e.target.value) })} /><Select value={form.shortDifficulty} onValueChange={(v) => setForm({ ...form, shortDifficulty: v })}><SelectTrigger className="bg-transparent border-gray-700 w-40"><SelectValue placeholder="Difficulty" /></SelectTrigger><SelectContent><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent></Select></div></div>
              <div><label>Long Questions (Theory)</label><div className="flex gap-2 mt-1"><Input type="number" className="w-24 bg-transparent border-gray-700" value={form.longCount} onChange={(e) => setForm({ ...form, longCount: Number(e.target.value) })} /><Select value={form.longDifficulty} onValueChange={(v) => setForm({ ...form, longDifficulty: v })}><SelectTrigger className="bg-transparent border-gray-700 w-40"><SelectValue placeholder="Difficulty" /></SelectTrigger><SelectContent><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent></Select></div></div>
              <div><label>Coding Questions</label><Input type="number" className="w-28 bg-transparent border-gray-700 mt-1" value={form.codingCount} onChange={(e) => setForm({ ...form, codingCount: Number(e.target.value) })} /></div>
            </div>
          </div>
          <div className="px-2"><label>Instructions / Notes</label><Textarea placeholder="Add instructions for the paper" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} className="bg-transparent border-gray-700" /></div>
          <DialogFooter><Button onClick={() => setOpenModal(false)} variant="ghost">Cancel</Button><Button onClick={handleSaveExam} disabled={saving} className="bg-indigo-700 hover:bg-indigo-600">{saving ? "Saving..." : "Save Exam"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loadingExams ? (<div className="col-span-full text-center py-10">Loading exams...</div>)
         : exams.length === 0 ? (<div className="col-span-full text-center py-10">No exams created yet.</div>)
         : (exams.map((exam) => (
            <div key={exam._id} className="bg-[#07101a] border border-indigo-900 rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{exam.title}</h3>
                  <div className="text-sm text-gray-400">{exam.subject?.name} {exam.subject?.code ? `(${exam.subject.code})` : ""}</div>
                  <div className="text-sm text-gray-500 mt-2">Class: {exam.course}</div>
                  <div className="text-sm text-gray-500">Duration: {exam.duration} min</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`text-xs font-bold px-2 py-1 rounded-full ${exam.status === 'published' ? 'bg-green-800 text-green-200' : 'bg-gray-700 text-gray-300'}`}>
                    {(exam.status || "draft").toUpperCase()}
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => openEditModal(exam)} className="bg-transparent border border-gray-700 hover:bg-indigo-800"><Edit3 className="w-4 h-4" /></Button>
                    <Button size="icon" variant="outline" onClick={() => handleGeneratePaper(exam._id)} disabled={generating === exam._id} className="bg-teal-600 hover:bg-teal-500"><Play className="w-4 h-4" /></Button>
                    <Link href={`/faculty/question-paper/${exam._id}`} passHref><Button className="bg-transparent border border-gray-700 hover:bg-indigo-800" asChild size="icon" variant="outline"><Eye className="w-4 h-4" /></Button></Link>
                    <Button onClick={() => handlePublish(exam._id)} className="bg-indigo-700 hover:bg-indigo-600">Publish</Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-300">
                {/* FIX 3: Use the helper function for an accurate count */}
                Questions: {countQuestions(exam.questions)}
              </div>
              <div className="mt-3 flex gap-2"><Button variant="destructive-outline" onClick={() => handleDelete(exam._id)} className="text-red-500 border border-red-600">Delete</Button></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
