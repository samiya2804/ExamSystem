"use client";

import Link from "next/link";
import { GraduationCap, Users, UserCog, Home } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold flex items-center gap-2 text-indigo-600">
        <GraduationCap className="w-6 h-6" /> AI Exam System
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/" className="hover:text-indigo-600 flex items-center gap-1">
          <Home className="w-4 h-4" /> Home
        </Link>
        <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
          Login
        </Link>
      </div>
    </nav>
  );
}
