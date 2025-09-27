// components/admin/ExamMonitor.tsx
"use client";

import { Eye, Monitor } from "lucide-react";

const ongoingExams = [
  {
    id: "E101",
    title: "Computer Science Midterm",
    course: "CS-101",
    teacher: "Dr. Sarah Johnson",
    start: "03:22 PM",
    end: "06:22 PM",
    total: 45,
    active: 42,
    submitted: 3,
    remaining: "2h 0m",
    alerts: [
      { id: "A1", type: "warning", text: "Student switched tabs multiple times", student: "S001" },
      { id: "A2", type: "info", text: "Low battery warning from mobile device", student: "S023" },
    ],
  },
];

export default function ExamMonitor() {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-sm border">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-white">Active Exam Monitor</h3>
          <p className="text-sm text-white">Real-time monitoring of ongoing examinations</p>
        </div>

        <div className="text-sm text-white">{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
      </div>

      {ongoingExams.map((e) => (
        <div key={e.id} className="border rounded-md p-4 bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-800">{e.title}</h4>
              <div className="text-sm text-white mt-1">{e.course} • {e.teacher} • {e.start} - {e.end}</div>
            </div>

            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" /> <span className="text-sm">View Details</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden border">
              <div className="h-full bg-teal-600" style={{ width: `${(e.active / e.total) * 100}%` }} />
            </div>
            <div className="grid grid-cols-3 text-center mt-4">
              <div>
                <div className="text-2xl font-semibold text-white">{e.total}</div>
                <div className="text-sm text-white">Total Students</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-emerald-600">{e.active}</div>
                <div className="text-sm text-white">Currently Active</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-white">{e.submitted}</div>
                <div className="text-sm text-white">Submitted</div>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="font-medium text-slate-800">Recent Alerts</h5>
              <ul className="mt-2 space-y-3">
                {e.alerts.map(a => (
                  <li key={a.id} className="flex items-start gap-3">
                    <div>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${a.type === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>!</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{a.text}</div>
                      <div className="text-xs text-white">Student ID: {a.student}</div>
                    </div>
                    <div className="ml-auto text-white">↗</div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
