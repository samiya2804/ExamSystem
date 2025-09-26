"use client";

import { useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Faculty = {
  id: string;
  name: string;
  email: string;
  department: string;
};

export default function AddFacultyPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([
    {
      id: "F001",
      name: "Dr. Mohammad Iqbal",
      email: "iqbal@univ.edu",
      department: "CSE",
    },
    {
      id: "F002",
      name: "Prof. Samiya Saqi",
      email: "samiya@univ.edu",
      department: "AI",
    },
  ]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  const handleAdd = () => {
    if (!name || !email || !department) return;
    const newFaculty = {
      id: `F${(faculties.length + 1).toString().padStart(3, "0")}`,
      name,
      email,
      department,
    };
    setFaculties([...faculties, newFaculty]);
    setName("");
    setEmail("");
    setDepartment("");
  };

  const handleDelete = (id: string) => {
    setFaculties(faculties.filter((f) => f.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-950 min-h-screen text-gray-100">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-400">
        <UserPlus className="w-6 h-6 text-blue-500" /> Manage Faculty
      </h1>

      {/* Form */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
        />
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
        />
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border border-gray-700 text-gray-100">
            <SelectItem value="CSE">CSE</SelectItem>
            <SelectItem value="AI">AI</SelectItem>
            <SelectItem value="Maths">Maths</SelectItem>
            <SelectItem value="Physics">Physics</SelectItem>
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
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Department</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faculties.map((f, idx) => (
              <tr
                key={f.id}
                className={`border-t border-gray-800 ${
                  idx % 2 === 0 ? "bg-gray-950" : "bg-gray-900"
                }`}
              >
                <td className="py-3 px-4 font-medium text-gray-100">
                  {f.name}
                </td>
                <td className="py-3 px-4 text-gray-300">{f.email}</td>
                <td className="py-3 px-4 text-gray-300">{f.department}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    className="text-red-500 hover:text-red-400 transition"
                    onClick={() => handleDelete(f.id)}
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
