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
    <div className="w-full grid grid-cols-1  gap-6">
      {/* ===== Area Chart ===== */}
      <div className="bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700 flex flex-col h-[350px] sm:h-[400px]">
        <h4 className="text-white font-medium mb-3 text-sm sm:text-base text-center sm:text-left">
          Total Exams (Course-wise)
        </h4>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <XAxis dataKey="course" stroke="#ccc" tick={{ fontSize: 12 }} />
              <YAxis stroke="#ccc" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="totalExams"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.25}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== Pie Chart ===== */}
      <div className="bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700 flex flex-col h-[350px] sm:h-[400px]">
        <h4 className="text-white font-medium mb-3 text-sm sm:text-base text-center sm:text-left">
          Total Exams (Subject-wise)
        </h4>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="70%"
                label={({ name, value }) => `${name} (${value})`}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  fontSize: "12px",
                  color: "#ccc",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ab1f86ff",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
