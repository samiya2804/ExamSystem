// src/app/api/exams/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Exam from '@/lib/models/Exam'; // 
import Question from '@/lib/models/Question';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, subject, duration, questions } = body;

    // 1. Create and save all questions first
    const questionIds = [];
    for (const q of questions) {
      const newQuestion = new Question(q);
      const savedQuestion = await newQuestion.save();
      questionIds.push(savedQuestion._id);
    }

    // 2. Create the exam, referencing the saved question IDs
    const newExam = new Exam({
      title,
      subject,
      durationInMinutes: duration,
      questions: questionIds,
    });

    const savedExam = await newExam.save();
    return NextResponse.json(savedExam, { status: 201 });

  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const exams = await Exam.find().populate('questions').sort({ date: -1 });
    return NextResponse.json(exams, { status: 200 });

  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}