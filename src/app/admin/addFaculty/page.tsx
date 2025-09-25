"use client";

import { useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type Faculty = {
  id: string;
  name: string;
  email: string;
  department: string;
};

export default function AddFacultyPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([
    { id: "F001", name: "Dr. Mohammad Iqbal", email: "iqbal@univ.edu", department: "CSE" },
    { id: "F002", name: "Prof. Samiya Saqi", email: "samiya@univ.edu", department: "AI" },
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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <UserPlus className="w-6 h-6 text-teal-600" /> Manage Faculty
      </h1>

      {/* Form */}
      <div className="flex gap-3 mb-6">
        <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CSE">CSE</SelectItem>
            <SelectItem value="AI">AI</SelectItem>
            <SelectItem value="Maths">Maths</SelectItem>
            <SelectItem value="Physics">Physics</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleAdd}>Add</Button>
      </div>

      {/* Table */}
      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-slate-50 text-sm text-slate-500">
          <tr>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculties.map((f) => (
            <tr key={f.id} className="border-t bg-white">
              <td className="py-3 px-4 font-medium">{f.name}</td>
              <td className="py-3 px-4">{f.email}</td>
              <td className="py-3 px-4">{f.department}</td>
              <td className="py-3 px-4 text-right">
                <button
                  className="text-red-500 hover:text-red-600"
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
  );
}
