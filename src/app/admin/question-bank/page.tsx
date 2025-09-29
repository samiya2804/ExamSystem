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

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    type: "",
  });
  const [editQ, setEditQ] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Fetch questions from DB
  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleAdd = async () => {
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    });
    const saved = await res.json();
    setQuestions([saved, ...questions]);
    setNewQuestion({ questionText: "", type: "" });
  };

  const handleSave = async () => {
    if (!editQ) return;
    const res = await fetch(`/api/questions/${editQ._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editQ),
    });
    const updated = await res.json();
    setQuestions(questions.map((q) => (q._id === updated._id ? updated : q)));
    setEditQ(null);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/questions/${id}`, { method: "DELETE" });
    setQuestions(questions.filter((q) => q._id !== id));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file.name);
  };

  const filteredQuestions = questions.filter((q) =>
    q.questionText.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-950 min-h-screen text-gray-100">
      {/* Header + Back */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-blue-400">
          <BookOpen className="w-6 h-6 text-teal-400" /> Question Bank
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
        {uploadedFile && (
          <span className="text-sm text-gray-400">
            Uploaded: {uploadedFile}
          </span>
        )}
      </div>

      {/* Search */}
      <Input
        placeholder="Search questions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-64 bg-gray-900 text-gray-100 placeholder-gray-400 border-gray-700"
      />

      {/* Add Question */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700">
            <PlusCircle className="w-4 h-4" /> Add Question
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 text-gray-100">
          <DialogHeader>
            <DialogTitle>Add Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Enter Question"
              value={newQuestion.questionText}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, questionText: e.target.value })
              }
              className="bg-gray-800 text-gray-100 placeholder-gray-400"
            />
            <Select
              value={newQuestion.type}
              onValueChange={(val) => setNewQuestion({ ...newQuestion, type: val })}
            >
              <SelectTrigger className="bg-gray-800 text-gray-100 border-gray-700">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mcq">MCQ</SelectItem>
                <SelectItem value="short_answer">Short Answer</SelectItem>
                <SelectItem value="long_answer">Long Answer</SelectItem>
                <SelectItem value="coding">Coding</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleAdd} className="bg-teal-600 hover:bg-teal-700">
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Questions Table */}
      <div className="overflow-x-auto bg-gray-900 shadow-lg rounded-lg">
        <table className="w-full text-left text-gray-100">
          <thead className="text-sm text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-3 px-4">Question</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredQuestions.map((q) => (
              <tr
                key={q._id}
                className="hover:bg-gray-800 transition-colors duration-200"
              >
                <td className="py-3 px-4">{q.questionText}</td>
                <td className="py-3 px-4 capitalize">{q.type.replace("_", " ")}</td>
                <td className="py-3 px-4 text-right flex gap-3 justify-end">
                  {/* Edit */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="text-gray-400 hover:text-gray-100"
                        onClick={() => setEditQ(q)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </DialogTrigger>
                    {editQ && editQ._id === q._id && (
                      <DialogContent className="bg-gray-900 text-gray-100">
                        <DialogHeader>
                          <DialogTitle>Edit Question</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <Input
                            value={editQ.questionText}
                            onChange={(e) =>
                              setEditQ({ ...editQ, questionText: e.target.value })
                            }
                            className="bg-gray-800 text-gray-100 placeholder-gray-400"
                          />
                          <Select
                            value={editQ.type}
                            onValueChange={(val) =>
                              setEditQ({ ...editQ, type: val })
                            }
                          >
                            <SelectTrigger className="bg-gray-800 text-gray-100 border-gray-700">
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mcq">MCQ</SelectItem>
                              <SelectItem value="short_answer">Short Answer</SelectItem>
                              <SelectItem value="long_answer">Long Answer</SelectItem>
                              <SelectItem value="coding">Coding</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={handleSave}
                            className="bg-teal-600 hover:bg-teal-700"
                          >
                            Save
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                  {/* Delete */}
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(q._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}