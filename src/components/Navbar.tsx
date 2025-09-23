"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, User, LogOut, Settings, Home, BookOpen, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, refreshUser } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout");
      if (res.ok) {
        toast.success("Logged out successfully!");
        refreshUser(); // update navbar
      } else {
        toast.error("Logout failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo / App Name */}
        <Link href="/" className="text-xl font-bold tracking-wide">
          AI Exam System
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="flex items-center gap-1 hover:text-gray-200">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link href="/exams" className="flex items-center gap-1 hover:text-gray-200">
            <BookOpen className="w-4 h-4" /> Exams
          </Link>
          <Link href="/results" className="flex items-center gap-1 hover:text-gray-200">
            <BarChart2 className="w-4 h-4" /> Results
          </Link>

          {user ? (
            // Logged in user dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-indigo-500 flex items-center gap-1">
                  <User className="w-4 h-4" /> {user.email.split("@")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Not logged in
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
                  Login
                </Button>
              </Link>
              {/* <Link href="/signup">
                <Button variant="outline" className="border-white text-white hover:bg-indigo-500">
                  Sign Up
                </Button>
              </Link> */}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-indigo-500"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-500 px-6 py-4 space-y-4">
          <Link href="/" className="flex items-center gap-2 hover:text-gray-200">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link href="/exams" className="flex items-center gap-2 hover:text-gray-200">
            <BookOpen className="w-4 h-4" /> Exams
          </Link>
          <Link href="/results" className="flex items-center gap-2 hover:text-gray-200">
            <BarChart2 className="w-4 h-4" /> Results
          </Link>
          <hr className="border-indigo-400" />

          {user ? (
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 hover:text-gray-200">
                <User className="w-4 h-4" /> Profile
              </button>
              <button className="flex items-center gap-2 hover:text-gray-200">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button
                className="flex items-center gap-2 text-red-200"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" className="flex items-center gap-2 hover:text-gray-200">
                <User className="w-4 h-4" /> Login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
