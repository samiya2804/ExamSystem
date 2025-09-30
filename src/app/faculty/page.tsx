"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  BookOpen,
  Play,
  Eye,
  Edit3,
  ArrowLeft,
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

type Subject = { _id: string; name: string; code?: string };
type Exam = any;

export default function FacultyDashboardPage() {
  const { user,setUser } = useAuth(); // user should contain id, name, etc.
  const facultyId = user?.id
  const facultyName = user?.firstName;

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loadingExams, setLoadingExams] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [form, setForm] = useState<any>({
    title: "",
    course: "B.Tech",
    subjectId: "",
    duration: 180,
    veryShortCount: 5,
    veryShortDifficulty: "easy",
    shortCount: 5,
    shortDifficulty: "medium",
    longCount: 2,
    longDifficulty: "hard",
    codingCount: 0,
    instructions: "",
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    fetchSubjects();
    loadExams();
  }, []);

  async function fetchSubjects() {
    try {
      const res = await fetch("/api/subject");
      const data = await res.json();
      setSubjects(data || []);
    } catch (err) {
      console.error("Subjects fetch error", err);
    }
  }

  async function loadExams() {
    setLoadingExams(true);
    try {
      const url = facultyId ? `/api/exams?facultyId=${facultyId}` : `/api/exams`;
      const res = await fetch(url);
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
      title: "",
      course: "B.Tech",
      subjectId: "",
      duration: 180,
      veryShortCount: 5,
      veryShortDifficulty: "easy",
      shortCount: 5,
      shortDifficulty: "medium",
      longCount: 2,
      longDifficulty: "hard",
      codingCount: 0,
      instructions: "",
    });
    setOpenModal(true);
  }

  function openEditModal(exam: Exam) {
    setEditingExam(exam);
    setForm({
      title: exam.title,
      course: exam.course || "B.Tech",
      subjectId: exam.subject?._id || exam.subject,
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
        title: form.title,
        course: form.course,
        subject: form.subjectId,
        duration: form.duration,
        veryShort: { count: Number(form.veryShortCount), difficulty: form.veryShortDifficulty },
        short: { count: Number(form.shortCount), difficulty: form.shortDifficulty },
        long: { count: Number(form.longCount), difficulty: form.longDifficulty },
        coding: { count: Number(form.codingCount || 0) },
        instructions: form.instructions,
        facultyId: facultyId || undefined,
      };

      let saved: any;
      if (editingExam) {
        const res = await fetch(`/api/exams/${editingExam._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        saved = await res.json();
      } else {
        const res = await fetch("/api/exams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        saved = await res.json();
      }

      if (editingExam) {
        setExams((p) => p.map((e) => (e._id === saved._id ? saved : e)));
      } else {
        setExams((p) => [saved, ...p]);
      }

      setOpenModal(false);
      alert("Exam saved");
    } catch (err) {
      console.error("Save exam error", err);
      alert("Failed to save exam");
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePaper = async (examId: string) => {
    if (!confirm("Generate question paper using AI?")) return;
    setGenerating(examId);
    try {
      const res = await fetch(`/api/exams/${examId}/generate`, { method: "POST" });
      if (!res.ok) throw new Error("Generate failed");
      const updated = await res.json();
      setExams((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
      alert("Generation completed.");
    } catch (err) {
      console.error(err);
      alert("Failed to generate");
    } finally {
      setGenerating(null);
    }
  };

  const handlePublish = async (examId: string) => {
    if (!confirm("Publish this exam to students?")) return;
    try {
      const res = await fetch(`/api/exams/${examId}/publish`, { method: "PUT" });
      if (!res.ok) throw new Error("Publish failed");
      const updated = await res.json();
      setExams((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
      alert("Exam published.");
    } catch (err) {
      console.error(err);
      alert("Publish failed");
    }
  };

  const handleDelete = async (examId: string) => {
    if (!confirm("Delete this exam?")) return;
    try {
      const res = await fetch(`/api/exams/${examId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setExams((prev) => prev.filter((e) => e._id !== examId));
      alert("Exam deleted.");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
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
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-teal-300" />
            <h2 className="text-2xl font-semibold">Create New Exam</h2>
          </div>
          <div>
            <Button onClick={openCreateModal} className="bg-indigo-700 hover:bg-indigo-600">
              <PlusCircle className="w-4 h-4 mr-2" /> New Exam
            </Button>
          </div>
        </div>
        <p className="text-gray-400">Quickly create an exam, generate questions automatically with AI, preview, edit and publish.</p>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="bg-[#08101a] text-gray-100 rounded-lg w-full max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingExam ? "Edit Exam" : "Create Exam"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 space-y-3 p-2">
              <label className="text-sm text-gray-300">Exam Title</label>
              <Input
                placeholder="e.g., Mid-Term Exam"
                value={form.title}
                onChange={(e: any) => setForm({ ...form, title: e.target.value })}
                className="bg-transparent border border-gray-700"
              />

              <label className="text-sm text-gray-300">Select Subject</label>
              <Select value={form.subjectId} onValueChange={(v) => setForm({ ...form, subjectId: v })}>
                <SelectTrigger className="bg-transparent border border-gray-700">
                  <SelectValue placeholder="Choose a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.name} {s.code ? `(${s.code})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <label className="text-sm text-gray-300">Class / Course</label>
              <Input value={form.course} onChange={(e:any)=> setForm({...form, course: e.target.value})} className="bg-transparent border border-gray-700" />

              <label className="text-sm text-gray-300">Duration (minutes)</label>
              <Input type="number" value={form.duration} onChange={(e:any)=> setForm({...form, duration: Number(e.target.value)})} className="bg-transparent border border-gray-700" />
            </div>

            <div className="col-span-1 p-2 space-y-3">
              <div>
                <label className="text-sm text-gray-300">Very Short Questions</label>
                <div className="flex gap-2 mt-2">
                  <Input type="number" className="w-24 bg-transparent border border-gray-700" value={form.veryShortCount} onChange={(e:any)=> setForm({...form, veryShortCount: Number(e.target.value)})} />
                  <Select value={form.veryShortDifficulty} onValueChange={(v)=> setForm({...form, veryShortDifficulty: v})}>
                    <SelectTrigger className="bg-transparent border border-gray-700 w-40">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300">Short Questions</label>
                <div className="flex gap-2 mt-2">
                  <Input type="number" className="w-24 bg-transparent border border-gray-700" value={form.shortCount} onChange={(e:any)=> setForm({...form, shortCount: Number(e.target.value)})} />
                  <Select value={form.shortDifficulty} onValueChange={(v)=> setForm({...form, shortDifficulty: v})}>
                    <SelectTrigger className="bg-transparent border border-gray-700 w-40">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300">Long Questions</label>
                <div className="flex gap-2 mt-2">
                  <Input type="number" className="w-24 bg-transparent border border-gray-700" value={form.longCount} onChange={(e:any)=> setForm({...form, longCount: Number(e.target.value)})} />
                  <Select value={form.longDifficulty} onValueChange={(v)=> setForm({...form, longDifficulty: v})}>
                    <SelectTrigger className="bg-transparent border border-gray-700 w-40">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300">Coding Questions (optional)</label>
                <Input type="number" className="w-28 bg-transparent border border-gray-700" value={form.codingCount} onChange={(e:any)=> setForm({...form, codingCount: Number(e.target.value)})} />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm text-gray-300">Instructions / Notes</label>
            <Textarea placeholder="Add any extra instructions for the paper" value={form.instructions} onChange={(e:any)=> setForm({...form, instructions: e.target.value})} className="bg-transparent border border-gray-700" />
          </div>

          <DialogFooter>
            <Button onClick={() => { setOpenModal(false); setEditingExam(null); }} variant={"ghost"} className="mr-2">Cancel</Button>
            <Button onClick={handleSaveExam} disabled={saving} className="bg-indigo-700 hover:bg-indigo-600">{saving ? "Saving..." : (editingExam ? "Update Exam" : "Create Exam")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loadingExams ? (
          <div className="col-span-full text-center text-gray-400">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">No exams yet. Create one.</div>
        ) : (
          exams.map((exam) => (
            <div key={exam._id} className="bg-[#07101a] border border-indigo-900 rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{exam.title}</h3>
                  <div className="text-sm text-gray-400">{exam.subject?.name ? `${exam.subject.name} ${exam.subject.code ? `(${exam.subject.code})` : ""}` : ""}</div>
                  <div className="text-sm text-gray-500 mt-2">Class: {exam.course}</div>
                  <div className="text-sm text-gray-500">Duration: {exam.duration} min</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs text-gray-400">{(exam.status || "draft").toUpperCase()}</div>
                  <div className="flex gap-2">
                    <Button onClick={() => openEditModal(exam)} className="bg-transparent border border-gray-700 hover:bg-indigo-800">
                      <Edit3 className="w-4 h-4" />
                    </Button>

                    <Button onClick={() => handleGeneratePaper(exam._id)} disabled={generating === exam._id} className="bg-teal-600 hover:bg-teal-500">
                      <Play className="w-4 h-4" />
                    </Button>

                    <Link href={`/faculty/question-paper/${exam._id}`}>
                      <Button className="bg-transparent border border-gray-700 hover:bg-indigo-800">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button onClick={() => handlePublish(exam._id)} className="bg-indigo-700 hover:bg-indigo-600">Publish</Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-300">
                Questions: {exam.questions?.length || 0}
              </div>

              <div className="mt-3 flex gap-2">
                <Button variant="ghost" onClick={() => handleDelete(exam._id)} className="text-red-500 border border-red-600">Delete</Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
