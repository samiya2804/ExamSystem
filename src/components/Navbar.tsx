"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, User, LogOut, Settings, Home, BookOpen, BarChart2, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, refreshUser } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout");
      if (res.ok) {
        toast.success("Logged out successfully!");
        refreshUser();
      } else {
        toast.error("Logout failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <nav className="bg-teal-600 text-white shadow-lg rounded-b-xl">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / App Name */}
        <Link href="/" className="text-2xl font-bold tracking-wide transition-transform duration-200 hover:scale-105">
          AI Exam System
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="flex items-center gap-1 font-medium transition-colors duration-200 hover:text-gray-300">
            <Home className="w-5 h-5" /> Home
          </Link>
          <Link href="/exams" className="flex items-center gap-1 font-medium transition-colors duration-200 hover:text-gray-300">
            <BookOpen className="w-5 h-5" /> Exams
          </Link>
          <Link href="/results" className="flex items-center gap-1 font-medium transition-colors duration-200 hover:text-gray-300">
            <BarChart2 className="w-5 h-5" /> Results
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 rounded-full px-4 py-2 text-white font-medium hover:bg-white/20 transition-all duration-200">
                  <User className="w-5 h-5" /> {user.email.split("@")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-white shadow-xl rounded-xl p-2 mt-2 text-gray-800">
                <DropdownMenuItem className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <User className="w-4 h-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <Settings className="w-4 h-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="secondary" className="bg-white text-teal-600 font-bold rounded-full px-4 py-2 hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-md">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <ChevronUp className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu (Animated) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-teal-700 px-6 py-4 space-y-4 overflow-hidden"
          >
            <Link href="/" className="flex items-center gap-2 text-white font-medium hover:text-gray-300 transition-colors">
              <Home className="w-5 h-5" /> Home
            </Link>
            <Link href="/exams" className="flex items-center gap-2 text-white font-medium hover:text-gray-300 transition-colors">
              <BookOpen className="w-5 h-5" /> Exams
            </Link>
            <Link href="/results" className="flex items-center gap-2 text-white font-medium hover:text-gray-300 transition-colors">
              <BarChart2 className="w-5 h-5" /> Results
            </Link>
            <hr className="border-teal-600" />

            {user ? (
              <div className="flex flex-col gap-2">
                <button className="flex items-center gap-2 text-white font-medium hover:text-gray-300 transition-colors">
                  <User className="w-5 h-5" /> Profile
                </button>
                <button className="flex items-center gap-2 text-white font-medium hover:text-gray-300 transition-colors">
                  <Settings className="w-5 h-5" /> Settings
                </button>
                <button
                  className="flex items-center gap-2 text-red-300 font-medium hover:text-red-100 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" className="flex items-center gap-2 text-white font-medium hover:text-gray-300 transition-colors">
                  <User className="w-5 h-5" /> Login
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
