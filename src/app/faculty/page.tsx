"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FileText, Download } from "lucide-react";
import { useState, useEffect } from "react";

type Paper = {
  subject: string;
  veryShort: number;
  short: number;
  long: number;
  coding: number;
  instructions: string;
};

type Question = {
  text: string;
  marks: number;
};

export default function FacultyPage() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [veryShort, setVeryShort] = useState(0);
  const [short, setShort] = useState(0);
  const [longQ, setLongQ] = useState(0);
  const [coding, setCoding] = useState(0);
  const [instructions, setInstructions] = useState("");

  const [papers, setPapers] = useState<Paper[]>([]);

  useEffect(() => {
    // Simulate fetching subjects from admin
    setSubjects(["Java", "DBMS", "OS", "CN", "AI"]);
  }, []);

  const generatePaper = () => {
    if (!selectedSubject) return;
    const newPaper: Paper = {
      subject: selectedSubject,
      veryShort,
      short,
      long: longQ,
      coding,
      instructions,
    };
    setPapers([newPaper, ...papers]);

    // Reset form
    setSelectedSubject("");
    setVeryShort(0);
    setShort(0);
    setLongQ(0);
    setCoding(0);
    setInstructions("");
  };

  const generateQuestions = (paper: Paper, type: string, count: number, marks: number) => {
    return Array.from({ length: count }, (_, i) => ({
      text: `${type} Question ${i + 1}`,
      marks,
    }));
  };

  const totalMarks = (p: Paper) =>
    p.veryShort * 1 + p.short * 3 + p.long * 5 + p.coding * 10;

  return (
    <div className="container mx-auto py-10 px-6 space-y-8">
      <h1 className="text-3xl font-bold text-indigo-600">Faculty Dashboard</h1>
      <p className="text-gray-600">Select subject, set question types, and generate AI question paper</p>

      {/* Form */}
      <Card className="max-w-3xl mx-auto p-6 shadow-lg border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" /> Generate Question Paper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="font-semibold mb-1 block text-gray-700">Select Subject</label>
            <Select value={selectedSubject} onValueChange={(val) => setSelectedSubject(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subj, idx) => (
                  <SelectItem key={idx} value={subj}>
                    {subj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold block text-gray-700 mb-1">
                Very Short Questions <span className="text-sm text-gray-500">(Attempt all)</span>
              </label>
              <Input type="number" min={0} value={veryShort} onChange={(e) => setVeryShort(Number(e.target.value))} />
            </div>
            <div>
              <label className="font-semibold block text-gray-700 mb-1">
                Short Questions <span className="text-sm text-gray-500">(Attempt all)</span>
              </label>
              <Input type="number" min={0} value={short} onChange={(e) => setShort(Number(e.target.value))} />
            </div>
            <div>
              <label className="font-semibold block text-gray-700 mb-1">
                Long Questions <span className="text-sm text-gray-500">(Attempt any two)</span>
              </label>
              <Input type="number" min={0} value={longQ} onChange={(e) => setLongQ(Number(e.target.value))} />
            </div>
            <div>
              <label className="font-semibold block text-gray-700 mb-1">
                Coding Questions <span className="text-sm text-gray-500">(Attempt all)</span>
              </label>
              <Input type="number" min={0} value={coding} onChange={(e) => setCoding(Number(e.target.value))} />
            </div>
          </div>

          <div>
            <label className="font-semibold mb-1 block text-gray-700">Additional Instructions</label>
            <Textarea placeholder="Time, marks distribution, notes..." value={instructions} onChange={(e) => setInstructions(e.target.value)} />
          </div>

          <Button className="w-full text-lg" onClick={generatePaper}>
            Generate Paper Preview
          </Button>
        </CardContent>
      </Card>

      {/* Paper Preview */}
      {papers.map((p, idx) => (
        <Card key={idx} className="shadow-lg border print:border-none">
          <CardHeader className="bg-gray-100 p-4 text-center border-b border-gray-300">
            <h2 className="text-2xl font-bold">XYZ University</h2>
            <p className="text-gray-700 mt-1">{p.subject} Exam</p>
            <p className="mt-1">Total Marks: {totalMarks(p)}, Duration: 3 Hours</p>
          </CardHeader>
          <CardContent className="p-6 space-y-4 font-serif">
            {/* Sections */}
            {["Very Short", "Short", "Long", "Coding"].map((type) => {
              const count = type === "Very Short" ? p.veryShort : type === "Short" ? p.short : type === "Long" ? p.long : p.coding;
              const marks = type === "Very Short" ? 1 : type === "Short" ? 3 : type === "Long" ? 5 : 10;
              if (count === 0) return null;
              return (
                <div key={type}>
                  <h3 className="font-semibold text-lg border-b border-gray-300 pb-1">{type} Questions</h3>
                  <ol className="list-decimal ml-5 mt-2 space-y-1">
                    {generateQuestions(p, type, count, marks).map((q, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{q.text}</span>
                        <span className="font-semibold">{q.marks}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}

            {/* Instructions */}
            {p.instructions && (
              <div className="mt-4 p-3 bg-gray-50 border-l-4 border-indigo-600 rounded">
                <strong>Instructions:</strong> {p.instructions}
              </div>
            )}

            <Button variant="secondary" className="mt-4 w-full">
              Download PDF (Placeholder)
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
