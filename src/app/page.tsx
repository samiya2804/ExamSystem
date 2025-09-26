"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  FileText,
  Users,
  Brain,
  BookOpen,
  PieChart,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.8, 0.25, 1],
    },
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-gray-100 font-sans">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-32 text-center overflow-hidden bg-gradient-to-br from-blue-950 to-slate-900">
        <div className="relative z-10 p-6">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight text-blue-400"
          >
            AI Powered Exam System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto"
          >
            Streamline your online examinations with an intelligent, automated,
            and secure platform. Effortlessly manage question banks, ensure exam
            integrity with AI proctoring, and get instant, actionable analytics.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex gap-4 justify-center"
          >
            <Link href="/login">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer shadow-lg transition-transform duration-300 transform hover:-translate-y-1"
              >
                Get Started
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-400 text-blue-400 hover:bg-blue-950 rounded-xl cursor-pointer transition-transform duration-300 transform hover:-translate-y-1"
              >
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="py-24 bg-slate-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-blue-400">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <BarChart3 className="w-12 h-12 text-blue-400" />,
                title: "Real-time Analytics",
                desc: "Gain deep insights into performance with intuitive dashboards and reports.",
              },
              {
                icon: <FileText className="w-12 h-12 text-blue-400" />,
                title: "Smart Question Bank",
                desc: "Upload, organize, and filter questions by subject, difficulty, and type.",
              },
              {
                icon: <Users className="w-12 h-12 text-blue-400" />,
                title: "User Management",
                desc: "Easily manage students, assign roles, and control permissions.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-800 border border-slate-700 rounded-2xl shadow-lg hover:shadow-blue-500/30 transition-all duration-500 transform hover:-translate-y-1">
                  <CardHeader className="flex flex-col items-center">
                    {feature.icon}
                    <CardTitle className="text-xl text-white font-semibold mt-4">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-300 text-center px-4 pb-6">
                    {feature.desc}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="py-24 bg-slate-950"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold mb-16 text-blue-400">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <BookOpen className="w-12 h-12 text-blue-400" />,
                title: "1. Set Up",
                desc: "Admins upload question banks and configure exam parameters.",
              },
              {
                icon: <Brain className="w-12 h-12 text-blue-400" />,
                title: "2. Automated Exam",
                desc: "AI generates randomized, secure exams ensuring fairness.",
              },
              {
                icon: <PieChart className="w-12 h-12 text-blue-400" />,
                title: "3. Review & Analyze",
                desc: "Instant grading with real-time analytics for improvement.",
              },
            ].map((step, idx) => (
              <Card
                key={idx}
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-lg p-8 transform hover:-translate-y-1 hover:shadow-blue-500/20 transition-all duration-500"
              >
                <CardHeader className="flex flex-col items-center">
                  {step.icon}
                  <CardTitle className="text-2xl text-white font-bold mt-4">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 mt-4">
                  {step.desc}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        className="py-24 bg-slate-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold mb-16 text-blue-400">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Secure & Reliable",
                desc: "Built with robust security protocols and AI-powered monitoring.",
              },
              {
                title: "Advanced AI",
                desc: "Cutting-edge AI for randomization, personalization & analysis.",
              },
              {
                title: "Intuitive Experience",
                desc: "Clean interface for admins & students, making exams stress-free.",
              },
            ].map((reason, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col items-center p-8 bg-slate-800 border border-slate-700 rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all duration-500">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                  <h3 className="mt-6 text-xl font-semibold text-white">
                    {reason.title}
                  </h3>
                  <p className="text-gray-300 mt-2">{reason.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="py-24 bg-slate-950"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold mb-16 text-blue-400">
            Trusted by Educators & Students
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <Card className="bg-slate-800 border border-slate-700 rounded-2xl shadow-lg p-8 hover:shadow-blue-500/20 transition-all duration-500">
              <CardContent className="p-0 text-gray-300 italic text-lg">
                &quot;The AI-powered analytics saved our faculty countless hours.
                It’s a game-changer for academic assessment.&ldquo;
                <p className="mt-6 font-semibold text-blue-300 not-italic text-lg">
                  - Dr. Anjali Rao, Head of CS Dept.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border border-slate-700 rounded-2xl shadow-lg p-8 hover:shadow-blue-500/20 transition-all duration-500">
              <CardContent className="p-0 text-gray-300 italic text-lg">
                &quot;Taking exams on this platform was smooth and stress-free.
                The interface is simple and easy to navigate.&quot;
                <p className="mt-6 font-semibold text-blue-300 not-italic text-lg">
                  - Rohan V., B.Tech Student
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <section className="py-20 bg-blue-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Innovate Your Exams?
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            Join the next generation of AI-powered exam management today and
            take the first step towards a smarter, more secure assessment
            process.
          </p>
          <Link href="/login">
            <Button className="bg-white text-blue-700 font-semibold rounded-xl cursor-pointer hover:bg-gray-200 transition-transform duration-300 transform hover:scale-105 shadow-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
