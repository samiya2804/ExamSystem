"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#9ca3af"];

export default function ChartsPanel() {
  const [areaData, setAreaData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/analytics");
        const data = await res.json();
        setAreaData(data.areaData || []);
        setPieData(data.pieData || []);
      } catch (err) {
        console.error("Failed to fetch chart data", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Course-wise Exams (Area Chart) */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-sm border h-64">
        <h4 className="text-white font-medium mb-2">Total Exams (Course-wise)</h4>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={areaData}>
            <XAxis dataKey="course" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="totalExams"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Subject-wise Exams (Pie Chart) */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-sm border h-100">
        <h4 className="text-white font-medium ">Total Exams (Subject-wise)</h4>
        <ResponsiveContainer width="100%" height="100%" className="p-10">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
