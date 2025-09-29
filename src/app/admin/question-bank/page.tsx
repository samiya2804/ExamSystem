/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  PlusCircle,
  Edit3,
  Trash2,
  BookOpen,
  Upload,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Subject = {
  _id: string;
  name: string;
  code: string;
  topics: string[];
  faculty: { _id: string; name: string; email: string; department: string } | null;
};

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Fetch questions
  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then(setQuestions)
      .catch(console.error);
  }, []);

  // Fetch subjects
  useEffect(() => {
    fetch("/api/subject")
      .then((res) => res.json())
      .then(setSubjects)
      .catch(console.error);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file.name);
  };

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.topics.join(", ").toLowerCase().includes(search.toLowerCase()) ||
      s.faculty?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteSubject = async (id: string) => {
    const res = await fetch(`/api/subject/${id}`, { method: "DELETE" });
    if (res.ok) setSubjects(subjects.filter((s) => s._id !== id));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-950 min-h-screen text-gray-100">
      {/* Header + Back */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-blue-400">
          <BookOpen className="w-6 h-6 text-teal-400" /> Question Bank & Subjects
        </h1>
        <Link href="/admin" className="w-full md:w-auto">
          <Button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Upload PDF */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <label className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer bg-gray-900 hover:bg-gray-800 text-gray-100 w-full sm:w-auto">
          <Upload className="w-4 h-4 text-teal-400" />
          <span>Upload Question Bank (PDF)</span>
          <input type="file" accept="application/pdf" hidden onChange={handleUpload} />
        </label>
        {uploadedFile && <span className="text-sm text-gray-400">Uploaded: {uploadedFile}</span>}
      </div>

      {/* Search Subjects */}
      <Input
        placeholder="Search subjects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-64 bg-gray-900 text-gray-100 placeholder-gray-400 border-gray-700"
      />

      {/* Subjects Table */}
      <div className="overflow-x-auto bg-gray-900 shadow-lg rounded-lg mt-4">
        <table className="w-full text-left text-gray-100">
          <thead className="text-sm text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Topics</th>
              <th className="py-3 px-4">Faculty</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredSubjects.map((s, idx) => (
              <tr
                key={s._id}
                className={`${
                  idx % 2 === 0 ? "bg-gray-950" : "bg-gray-900"
                } hover:bg-gray-800 transition`}
              >
                <td className="py-3 px-4 text-gray-300">{s.code}</td>
                <td className="py-3 px-4 font-medium text-gray-100">{s.name}</td>
                <td className="py-3 px-4 text-gray-300">
                  {s.topics?.length ? s.topics.join(", ") : "—"}
                </td>
                <td className="py-3 px-4 text-gray-300">{s.faculty?.name || "—"}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    className="text-red-500 hover:text-red-400 transition"
                    onClick={() => handleDeleteSubject(s._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredSubjects.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No subjects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
