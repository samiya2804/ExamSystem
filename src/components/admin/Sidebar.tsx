"use client";

import Link from "next/link";
import { Book, PieChart, Grid, Shield } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen p-6 flex flex-col">
      {/* Logo / Header */}
      <div className="mb-8">
        <div className="text-lg font-bold text-teal-400">AI Exam System</div>
        <p className="text-sm text-gray-400 mt-1">Admin Console</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        <Link
          href="/admin"
          className="flex items-center gap-3 p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <Grid className="w-5 h-5" /> Dashboard
        </Link>

        <Link
          href="/admin/question-bank"
          className="flex items-center gap-3 p-3 rounded-lg text-gray-200 hover:bg-gray-800 transition"
        >
          <Book className="w-5 h-5 text-gray-200" /> Question Bank
        </Link>

        <Link
          href="/admin/analytics"
          className="flex items-center gap-3 p-3 rounded-lg text-gray-200 hover:bg-gray-800 transition"
        >
          <PieChart className="w-5 h-5 text-gray-200" /> Analytics
        </Link>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6">
        <div className="border-t border-gray-800 pt-6">
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" /> Admin Access
          </div>
        </div>
      </div>
    </aside>
  );
}
