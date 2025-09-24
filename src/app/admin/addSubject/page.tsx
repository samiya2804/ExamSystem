"use client";

import { useState } from "react";
import { Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-indigo-600" /> Manage Subjects
      </h1>

      {/* Form */}
      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Enter subject name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />
        <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Assign Faculty" />
          </SelectTrigger>
          <SelectContent>
            {faculties.map((f, i) => (
              <SelectItem key={i} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAdd}>Add</Button>
      </div>

      {/* Table */}
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
            <tr key={s.id} className="border-t bg-white">
              <td className="py-3 px-4 font-medium">{s.name}</td>
              <td className="py-3 px-4">{s.faculty}</td>
              <td className="py-3 px-4 text-right">
                <button
                  className="text-red-500 hover:text-red-600"
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
  );
}
