// components/admin/Sidebar.tsx
"use client";

import Link from "next/link";
import { Book, PieChart, Grid, Shield } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6">
      <div className="mb-8">
        <div className="text-lg font-bold text-teal-700">AI Exam System</div>
        <p className="text-sm text-slate-500 mt-1">Admin Console</p>
      </div>

      <nav className="space-y-2">
        <Link href="/admin" className="flex items-center gap-3 p-3 rounded-md bg-teal-700 text-white">
          <Grid className="w-5 h-5" /> Dashboard
        </Link>

        <Link href="/admin/question-bank" className="flex items-center gap-3 p-3 rounded-md text-slate-700 hover:bg-slate-50">
          <Book className="w-5 h-5 text-slate-600" /> Question Bank
        </Link>

        <Link href="/admin/analytics" className="flex items-center gap-3 p-3 rounded-md text-slate-700 hover:bg-slate-50">
          <PieChart className="w-5 h-5 text-slate-600" /> Analytics
        </Link>
      </nav>

      <div className="mt-auto pt-6">
        <div className="border-t pt-6">
          <div className="text-sm text-slate-600 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Admin Access
          </div>
        </div>
      </div>
    </aside>
  );
}
