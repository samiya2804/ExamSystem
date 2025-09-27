"use client";

import { useEffect, useState } from "react";
import { Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  faculty: {
    _id: string;
    name: string;
    email: string;
    department: string;
  };
};

type Faculty = {
  _id: string;
  name: string;
  email: string;
  department: string;
};

export default function AddSubjectPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [subjectName, setSubjectName] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");

  // Load subjects + faculties
  useEffect(() => {
    fetch("/api/subject")
      .then((res) => res.json())
      .then(setSubjects);

    fetch("/api/faculty")
      .then((res) => res.json())
      .then(setFaculties);
  }, []);

  const handleAdd = async () => {
    if (!subjectName || !selectedFaculty) return;

    const res = await fetch("/api/subject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: subjectName,
        faculty: selectedFaculty, // faculty _id
      }),
    });

    if (res.ok) {
      const newSubject = await res.json();
      setSubjects((prev) => [...prev, newSubject]);
      setSubjectName("");
      setSelectedFaculty("");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/subject/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSubjects(subjects.filter((s) => s._id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-950 min-h-screen text-gray-100">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-400">
        <BookOpen className="w-6 h-6 text-blue-500" /> Manage Subjects
      </h1>

      {/* Form */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <Input
          placeholder="Enter subject name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
        />
        <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
          <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
            <SelectValue placeholder="Assign Faculty" />
          </SelectTrigger>

          <SelectContent className="bg-gray-900 border border-gray-700 text-gray-100">
            {faculties.map((f, i) => (
              <SelectItem key={i} value={f}>
                {f}

          <SelectContent>
            {faculties.map((f) => (
              <SelectItem key={f._id} value={f._id}>
                {f.name} ({f.department})

              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          Add
        </Button>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-lg border border-gray-800 shadow">
        <table className="w-full">
          <thead className="bg-gray-900 text-sm text-gray-400">
            <tr>
              <th className="py-3 px-4 text-left">Subject</th>
              <th className="py-3 px-4 text-left">Faculty</th>
              <th className="py-3 px-4 text-right">Actions</th>

      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-slate-50 text-sm text-slate-500">
          <tr>
            <th className="py-3 px-4">Subject</th>
            <th className="py-3 px-4">Faculty</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s) => (
            <tr key={s._id} className="border-t bg-white">
              <td className="py-3 px-4 font-medium">{s.name}</td>
              <td className="py-3 px-4">{s.faculty?.name || "—"}</td>
              <td className="py-3 px-4 text-right">
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(s._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>

            </tr>
          </thead>
          <tbody>
            {subjects.map((s, idx) => (
              <tr
                key={s.id}
                className={`border-t border-gray-800 ${
                  idx % 2 === 0 ? "bg-gray-950" : "bg-gray-900"
                }`}
              >
                <td className="py-3 px-4 font-medium text-gray-100">{s.name}</td>
                <td className="py-3 px-4 text-gray-300">{s.faculty}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    className="text-red-500 hover:text-red-400 transition"
                    onClick={() => handleDelete(s.id)}
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
