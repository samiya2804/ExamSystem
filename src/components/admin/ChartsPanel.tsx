// components/admin/ChartsPanel.tsx
"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const areaData = [
  { week: "W1", Java: 60, DBMS: 45, OOPS: 30 },
  { week: "W2", Java: 68, DBMS: 50, OOPS: 35 },
  { week: "W3", Java: 72, DBMS: 55, OOPS: 40 },
  { week: "W4", Java: 78, DBMS: 60, OOPS: 50 },
];

const pieData = [
  { name: "Java", value: 40 },
  { name: "DBMS", value: 25 },
  { name: "OOPS", value: 20 },
  { name: "OS", value: 10 },
  { name: "Other", value: 5 },
];

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#9ca3af"];

export default function ChartsPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-700 rounded-lg p-4 shadow-sm border h-64">
        <h4 className="bg-gray-700 font-medium mb-2">Topic Performance (Last 4 weeks)</h4>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={areaData}>
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="Java" stroke="#4f46e5" fill="#eef2ff" />
            <Area type="monotone" dataKey="DBMS" stroke="#06b6d4" fill="#ecfeff" />
            <Area type="monotone" dataKey="OOPS" stroke="#10b981" fill="#ecfdf5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 shadow-sm border h-64">
        <h4 className="bg-gray-700 font-medium mb-4">Course Distribution (B.Tech)</h4>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom"  height={36}/>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
