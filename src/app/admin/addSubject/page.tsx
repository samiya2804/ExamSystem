"use client";

import { useState } from "react";
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
  id: string;
  name: string;
  faculty: string;
};

const faculties = ["Dr. Mohammad Iqbal", "Prof. Samiya Saqi", "Dr. Sarah Johnson"];

export default function AddSubjectPage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "S001", name: "Computer Networks", faculty: "Dr. Mohammad Iqbal" },
    { id: "S002", name: "Database Systems", faculty: "Prof. Samiya Saqi" },
  ]);

  const [subjectName, setSubjectName] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");

  const handleAdd = () => {
    if (!subjectName || !selectedFaculty) return;
    const newSubject = {
      id: `S${(subjects.length + 1).toString().padStart(3, "0")}`,
      name: subjectName,
      faculty: selectedFaculty,
    };
    setSubjects([...subjects, newSubject]);
    setSubjectName("");
    setSelectedFaculty("");
  };

  const handleDelete = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
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
