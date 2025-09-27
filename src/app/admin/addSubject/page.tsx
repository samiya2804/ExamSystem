"use client";

import { useEffect, useState } from "react";
import { Trash2, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Link from "next/link";

type Subject = {
  _id: string;
  name: string;
  faculty: {
    _id: string;
    name: string;
    email: string;
    department: string;
  } | null;
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
      .then(setSubjects)
      .catch(console.error);

    fetch("/api/faculty")
      .then((res) => res.json())
      .then(setFaculties)
      .catch(console.error);
  }, []);

  const handleAdd = async () => {
    if (!subjectName || !selectedFaculty) return;

    const res = await fetch("/api/subject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: subjectName,
        faculty: selectedFaculty,
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
      setSubjects((prev) => prev.filter((s) => s._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8 text-gray-100">
      {/* Header + Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-blue-400">
          <BookOpen className="w-6 h-6 text-teal-400" /> Manage Subjects
        </h1>
        <Link href="/admin">
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Form */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 flex-wrap w-full">
        <Input
          placeholder="Enter subject name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          className="flex-1 bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400"
        />

        <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
          <SelectTrigger className="w-full sm:w-60 bg-gray-900 border-gray-700 text-gray-100">
            <SelectValue placeholder="Assign Faculty" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border border-gray-700 text-gray-100">
            {faculties.map((f) => (
              <SelectItem key={f._id} value={f._id}>
                {f.name} ({f.department})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleAdd}
          className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto"
        >
          Add
        </Button>
      </div>

      {/* Subjects Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-800 bg-gray-900">
        <table className="w-full text-gray-100">
          <thead className="bg-gray-900 text-sm text-gray-400">
            <tr>
              <th className="py-3 px-4 text-left">Subject</th>
              <th className="py-3 px-4 text-left">Faculty</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {subjects.map((s, idx) => (
              <tr
                key={s._id}
                className={`${
                  idx % 2 === 0 ? "bg-gray-950" : "bg-gray-900"
                } hover:bg-gray-800 transition`}
              >
                <td className="py-3 px-4 font-medium text-gray-100">{s.name}</td>
                <td className="py-3 px-4 text-gray-300">{s.faculty?.name || "—"}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    className="text-red-500 hover:text-red-400 transition"
                    onClick={() => handleDelete(s._id)}
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
