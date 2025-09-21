"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, List } from "lucide-react";
import { useState } from "react";

type Subject = {
  name: string;
  syllabus: string;
};

export default function AdminPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [syllabus, setSyllabus] = useState("");

  const addSubject = () => {
    if (name && syllabus) {
      setSubjects([...subjects, { name, syllabus }]);
      setName("");
      setSyllabus("");
    }
  };

  return (
    <div className="container mx-auto py-10 px-6 space-y-8">
      <h1 className="text-3xl font-bold text-indigo-600">Admin Dashboard</h1>
      <p className="text-gray-600">Manage Subjects & Syllabus</p>

      {/* Add Subject Form */}
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-green-600" /> Add New Subject
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Subject Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Syllabus / Topics"
            value={syllabus}
            onChange={(e) => setSyllabus(e.target.value)}
          />
          <Button onClick={addSubject} className="w-full">
            Add Subject
          </Button>
        </CardContent>
      </Card>

      {/* Subjects List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5 text-indigo-600" /> Subjects List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <p className="text-gray-500">No subjects added yet.</p>
          ) : (
            <ul className="space-y-2">
              {subjects.map((subj, idx) => (
                <li
                  key={idx}
                  className="border p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{subj.name}</p>
                    <p className="text-gray-600">{subj.syllabus}</p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      setSubjects(subjects.filter((_, i) => i !== idx))
                    }
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
