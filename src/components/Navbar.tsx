"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  User,
  LogOut,
  Settings,
  Home,
  BookOpen,
  BarChart2,
  ChevronUp,
  ChevronDown,
  Bell,
  Brain,
} from "lucide-react";
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
import { usePathname } from "next/navigation"; 
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, setUser } = useAuth(); // <-- loading added


const pathname = usePathname();
    if (pathname && pathname.startsWith("/student/exam/")) {
    return null; // Return null to render nothing (hide the navbar)
  }

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Logged out successfully!");
        setUser(null);
      } else {
        toast.error("Logout failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };
  const handleProtectedRoute = (path: string) => {
  if (!user) {
    toast("Please login first!");
    window.location.href = "/login";
  } else {
    window.location.href = path;
  }
};

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg border-b border-blue-700">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / App Name */}
        {/* <Link
          href="/"
          className="text-2xl font-bold tracking-wide transition-transform duration-200 hover:scale-105"
        >
          AI Exam System
        </Link> */}

            <Link
        href="/"
       className="flex items-center space-x-2 text-2xl font-bold tracking-wide text-white transition-all duration-300 hover:scale-105 hover:text-blue-400" 
       >
        <div className="relative w-6 h-6 md:w-7 md:h-7">
          <Brain className="absolute top-0 left-0 w-full h-full text-blue-500 fill-blue-500/20" />
          
          </div>
          <span className="text-2xl md:text-lg lg:text-xl font-extrabold tracking-widest  bg-clip-text text-white drop-shadow-lg">
            AI Exam System
            </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link
            href="/"
            className="flex items-center gap-1 font-medium transition-colors duration-200 hover:text-blue-200"
          >
            <Home className="w-5 h-5" /> Home
          </Link>
          {/* <Link
            href="/notifications"
            className="flex items-center gap-1 font-medium transition-colors duration-200 hover:text-blue-200"
          >
            <Bell className="w-5 h-5" />
          </Link> */}

            <button
    onClick={() => handleProtectedRoute("/notifications")}
    className="flex items-center gap-1 font-medium transition-colors duration-200 hover:text-blue-200"
  >
    <Bell className="w-5 h-5" />  Notifications
  </button>
          

  <button
    onClick={() => handleProtectedRoute("/student/results")}
    className="flex items-center gap-1 font-medium transition-colors duration-200 hover:text-blue-200"
  >
    <BarChart2 className="w-5 h-5" /> Results
  </button>

          {!loading && ( // <-- only render after loading
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 rounded-full px-4 py-2 text-white font-medium hover:bg-blue-700/40 transition-all duration-200"
                    >
                      <User className="w-5 h-5" />
                      {user.firstName || user.email.split("@")[0]}
                      <ChevronDown className="w-4 h-4 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-44 bg-white shadow-2xl rounded-xl p-2 mt-2 text-gray-800 border border-gray-200"
                  >
                  <Link href="/profile" passHref>
          <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors duration-150">
            <User className="w-4 h-4 text-blue-600" /> Profile
          </DropdownMenuItem>
        </Link>
                       <Link href="/settings" passHref>
                    <DropdownMenuItem className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg cursor-pointer">
                      <Settings className="w-4 h-4 text-blue-600" /> Settings
                    </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      className="flex items-center gap-2 p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      onClick={async () => {
                        await fetch("/api/auth/logout", {
                          method: "POST",
                          credentials: "include",
                        });
                        setUser(null);
                        window.location.href = "/";
                      }}
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-3">
                  <Link href="/login">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-5 py-2 shadow-md transition-all duration-200">
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-white hover:bg-blue-700/40 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <ChevronUp className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu (Animated) */}
   {/* Mobile Menu (Animated) */}
<AnimatePresence>
  {menuOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="md:hidden bg-gradient-to-br from-indigo-900 to-gray-900 px-6 py-4 space-y-3 overflow-hidden"
    >
      <Link
        href="/"
        className="flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors"
      >
        <Home className="w-5 h-5 flex-shrink-0" /> 
        <span className="truncate">Home</span>
      </Link>
    <Link
        href="/notifications"
        className="flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors"
      >
        <Bell className="w-5 h-5 flex-shrink-0" /> 
        <span className="truncate">Notifications</span>
      </Link>

      <button
        onClick={() => handleProtectedRoute("/student/results")}
        className="flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors"
      >
        <BarChart2 className="w-5 h-5 flex-shrink-0" /> 
        <span className="truncate">Results</span>
      </button>

      <hr className="border-blue-600" />

      {!loading && (
        <>
          {user ? (
            <div className="flex flex-col gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
              >
                <User className="w-5 h-5 flex-shrink-0 text-blue-400" />
                <span className="truncate">Profile</span>
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
              >
                <Settings className="w-5 h-5 flex-shrink-0 text-blue-400" />
                <span className="truncate">Settings</span>
              </Link>

              <button
                className="flex items-center gap-2 text-red-400 font-medium hover:text-red-200 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                className="flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors"
              >
                <User className="w-5 h-5 flex-shrink-0" /> 
                <span className="truncate">Login</span>
              </Link>
            </div>
          )}
        </>
      )}
    </motion.div>
  )}
</AnimatePresence>

    </nav>
  );
}
