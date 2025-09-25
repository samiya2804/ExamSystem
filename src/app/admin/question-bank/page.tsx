"use client";

import { useState } from "react";
import { PlusCircle, Edit3, Trash2, BookOpen, Upload } from "lucide-react";
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

const demoQuestions = [
  { id: "Q001", subject: "OOPS", type: "Short", question: "What is polymorphism?" },
  { id: "Q002", subject: "DBMS", type: "Very Short", question: "Define Primary Key." },
  { id: "Q003", subject: "Java", type: "Long", question: "Explain JVM Architecture." },
];

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState(demoQuestions);
  const [newQuestion, setNewQuestion] = useState({ subject: "", type: "", question: "" });
  const [editQ, setEditQ] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Delete Question
  const handleDelete = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Save Edit
  const handleSave = () => {
    setQuestions(questions.map((q) => (q.id === editQ.id ? editQ : q)));
    setEditQ(null);
  };

  // Add Question
  const handleAdd = () => {
    const id = "Q" + (questions.length + 1).toString().padStart(3, "0");
    setQuestions([...questions, { id, ...newQuestion }]);
    setNewQuestion({ subject: "", type: "", question: "" });
  };

  // Upload PDF
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      // Later: Send file to backend API for parsing
    }
  };

  // Filtering + Searching
  const filteredQuestions = questions.filter((q) => {
    return (
      (filterSubject === "all" || q.subject === filterSubject) &&
      (filterType === "all" || q.type === filterType) &&
      (q.question.toLowerCase().includes(search.toLowerCase()) ||
        q.subject.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-teal-600" /> Question Bank
      </h1>

      {/* Upload PDF */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer bg-white hover:bg-slate-50">
          <Upload className="w-4 h-4 text-teal-600" />
          <span>Upload Question Bank (PDF)</span>
          <input type="file" accept="application/pdf" hidden onChange={handleUpload} />
        </label>
        {uploadedFile && (
          <span className="text-sm text-slate-600">Uploaded: {uploadedFile}</span>
        )}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64"
        />

        <Select
          value={filterSubject}
          onValueChange={(val) => setFilterSubject(val)}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filter by Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="OOPS">OOPS</SelectItem>
            <SelectItem value="DBMS">DBMS</SelectItem>
            <SelectItem value="Java">Java</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterType}
          onValueChange={(val) => setFilterType(val)}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Very Short">Very Short</SelectItem>
            <SelectItem value="Short">Short</SelectItem>
            <SelectItem value="Long">Long</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add Question */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700">
            <PlusCircle className="w-4 h-4" /> Add Question
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Enter Question"
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            />
            <Select
              value={newQuestion.subject}
              onValueChange={(val) => setNewQuestion({ ...newQuestion, subject: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OOPS">OOPS</SelectItem>
                <SelectItem value="DBMS">DBMS</SelectItem>
                <SelectItem value="Java">Java</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={newQuestion.type}
              onValueChange={(val) => setNewQuestion({ ...newQuestion, type: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Very Short">Very Short</SelectItem>
                <SelectItem value="Short">Short</SelectItem>
                <SelectItem value="Long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleAdd}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Questions Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left">
          <thead className="text-sm text-slate-500">
            <tr>
              <th className="py-3 px-4">Question</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredQuestions.map((q) => (
              <tr key={q.id}>
                <td className="py-3 px-4">{q.question}</td>
                <td className="py-3 px-4">{q.subject}</td>
                <td className="py-3 px-4">{q.type}</td>
                <td className="py-3 px-4 text-right flex gap-3 justify-end">
                  {/* Edit */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="text-slate-500 hover:text-slate-700"
                        onClick={() => setEditQ(q)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </DialogTrigger>
                    {editQ && editQ.id === q.id && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Question</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <Input
                            value={editQ.question}
                            onChange={(e) => setEditQ({ ...editQ, question: e.target.value })}
                          />
                          <Select
                            value={editQ.subject}
                            onValueChange={(val) => setEditQ({ ...editQ, subject: val })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OOPS">OOPS</SelectItem>
                              <SelectItem value="DBMS">DBMS</SelectItem>
                              <SelectItem value="Java">Java</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={editQ.type}
                            onValueChange={(val) => setEditQ({ ...editQ, type: val })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Very Short">Very Short</SelectItem>
                              <SelectItem value="Short">Short</SelectItem>
                              <SelectItem value="Long">Long</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleSave}>Save</Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                  {/* Delete */}
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(q.id)}
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
