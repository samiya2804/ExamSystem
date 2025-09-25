"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, Users, Brain, BookOpen, PieChart, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold tracking-tight text-white"
        >
          AI Powered Exam System
        </motion.h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl">
          Simplify online exams with automation, monitoring, analytics, and seamless question bank management.
        </p>
        <div className="mt-6 flex gap-4">
          <Link href="/login">
            <Button size="lg" className="bg-teal-600 text-white hover:bg-indigo-700">
              Get Started
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="bg-teal-600 text-white hover:bg-indigo-700">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-700 shadow-lg hover:shadow-xl transition">
              <CardHeader>
                <BarChart3 className="w-10 h-10 text-teal-400" />
                <CardTitle className="text-white">Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                Gain insights into student performance with real-time graphs and reports.
              </CardContent>
            </Card>
            <Card className="bg-gray-700 shadow-lg hover:shadow-xl transition">
              <CardHeader>
                <FileText className="w-10 h-10 text-teal-400" />
                <CardTitle className="text-white">Question Bank</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                Upload, manage, and filter questions by subject, type, and difficulty.
              </CardContent>
            </Card>
            <Card className="bg-gray-700 shadow-lg hover:shadow-xl transition">
              <CardHeader>
                <Users className="w-10 h-10 text-teal-400" />
                <CardTitle className="text-white">Faculty & Students</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                Easily manage users, assign faculties, and monitor students.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-white">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-700">
              <CardHeader>
                <BookOpen className="w-10 h-10 text-teal-400" />
                <CardTitle className="text-white">Step 1: Upload</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                Admin uploads question banks & exam details.
              </CardContent>
            </Card>
            <Card className="bg-gray-700">
              <CardHeader>
                <Brain className="w-10 h-10 text-teal-400" />
                <CardTitle className="text-white">Step 2: AI Exam</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                System generates randomized, secure exams automatically.
              </CardContent>
            </Card>
            <Card className="bg-gray-700">
              <CardHeader>
                <PieChart className="w-10 h-10 text-teal-400" />
                <CardTitle className="text-white">Step 3: Analyze</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                Get insights from analytics dashboard instantly.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-white">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-10 h-10 text-green-400" />
              <h3 className="mt-4 font-semibold text-white">Secure & Reliable</h3>
              <p className="text-gray-300 mt-2">Built with advanced authentication & monitoring.</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-10 h-10 text-green-400" />
              <h3 className="mt-4 font-semibold text-white">AI-Powered</h3>
              <p className="text-gray-300 mt-2">Leverages AI for question selection & analysis.</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-10 h-10 text-green-400" />
              <h3 className="mt-4 font-semibold text-white">Easy to Use</h3>
              <p className="text-gray-300 mt-2">Designed with simplicity and efficiency in mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-white">What People Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-700 shadow-md">
              <CardContent className="p-6 text-gray-300">
                "This exam system made managing tests so much easier. The analytics saved us hours!"
                <p className="mt-4 font-semibold text-white">- Professor Sharma</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-700 shadow-md">
              <CardContent className="p-6 text-gray-300">
                "Seamless exam experience. Loved the AI-powered features!"
                <p className="mt-4 font-semibold text-white">- Student, B.Tech CSE</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Automate Exams?</h2>
        <p className="mb-6">Join the next-gen AI powered exam management system today.</p>
        <Link href="/login">
          <Button size="lg" className="bg-teal-600 text-white hover:bg-teal-700">
            Get Started
          </Button>
        </Link>
      </section>
    </main>
  );
}
