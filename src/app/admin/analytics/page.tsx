"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, XAxis, YAxis, Legend, Bar } from "recharts";
import { BarChart2, PieChart as PieIcon, Activity } from "lucide-react";

const subjectData = [
  { name: "OOPS", students: 120 },
  { name: "DBMS", students: 95 },
  { name: "Java", students: 140 },
  { name: "AI", students: 80 },
];

const examData = [
  { name: "OOPS", ongoing: 2 },
  { name: "DBMS", ongoing: 1 },
  { name: "Java", ongoing: 3 },
  { name: "AI", ongoing: 0 },
];

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Activity className="w-6 h-6 text-teal-600" /> Analytics Dashboard
      </h1>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-teal-600" /> Students Enrolled per Subject
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <PieIcon className="w-5 h-5 text-teal-600" /> Subject Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectData}
                dataKey="students"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {subjectData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exam Monitor */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="font-semibold text-lg mb-4">Exam Monitor (Ongoing Exams)</h2>
        <ul className="space-y-2">
          {examData.map((e) => (
            <li key={e.name} className="flex justify-between p-3 border rounded-md">
              <span>{e.name}</span>
              <span className={e.ongoing > 0 ? "text-green-600 font-medium" : "text-gray-500"}>
                {e.ongoing > 0 ? `${e.ongoing} ongoing` : "No exams"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
