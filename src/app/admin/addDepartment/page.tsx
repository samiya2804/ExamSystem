"use client";

import { useEffect, useState } from "react";
import { Building2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Department = {
  _id: string;
  name: string;
  code: string;
};

export default function AddDepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  // Load departments
  useEffect(() => {
    fetch("/api/department")
      .then((res) => res.json())
      .then(setDepartments);
  }, []);

  const handleAdd = async () => {
    if (!name || !code) return;
    const res = await fetch("/api/department", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, code }),
    });
    if (res.ok) {
      const newDept = await res.json();
      setDepartments((prev) => [...prev, newDept]);
      setName("");
      setCode("");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/department/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDepartments(departments.filter((d) => d._id !== id));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Building2 className="w-6 h-6 text-teal-600" /> Manage Departments
      </h1>

      {/* Form */}
      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Code (e.g., CSE)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button onClick={handleAdd}>Add</Button>
      </div>

      {/* Table */}
      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-slate-50 text-sm text-slate-500">
          <tr>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Code</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr key={d._id} className="border-t bg-white">
              <td className="py-3 px-4 font-medium">{d.name}</td>
              <td className="py-3 px-4">{d.code}</td>
              <td className="py-3 px-4 text-right">
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(d._id)}
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
