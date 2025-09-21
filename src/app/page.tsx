"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, UserCheck, BarChart } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="container mx-auto py-12 space-y-16 px-6">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-indigo-600">
          AI Exam System
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto text-lg">
          Automate question paper generation, evaluate student answers with AI,
          and track performance in real-time. Say goodbye to manual exams!
        </p>
        <Link href="/login">
          <Button className="px-6 py-3 text-lg">Get Started</Button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="hover:shadow-xl transition transform hover:-translate-y-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" /> AI Question Papers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Faculty selects subject, difficulty, and marks — AI generates a full question paper.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition transform hover:-translate-y-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-green-600" /> Student Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Students write answers offline and upload scanned sheets online for AI evaluation.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition transform hover:-translate-y-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-6 h-6 text-purple-600" /> Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              AI scores answers, provides topic-wise feedback, and shows interactive dashboards.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <Link href="/login">
          <Button className="px-8 py-4 text-xl">Login & Explore</Button>
        </Link>
      </div>
    </section>
  );
}
