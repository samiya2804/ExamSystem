// src/app/api/exams/[id]/route.ts

import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Exam from '@/lib/models/Exam';
import Question from '@/lib/models/Question';

// PUT handler to update an exam
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();

    
    if (body.isPublished !== undefined) {
      const updatedExam = await Exam.findByIdAndUpdate(
        id,
        { isPublished: body.isPublished },
        { new: true }
      ).populate('questions'); // Populate to return the full exam object

      if (!updatedExam) {
        return NextResponse.json({ message: "Exam not found" }, { status: 404 });
      }
      return NextResponse.json(updatedExam, { status: 200 });

    } else {
      // Full exam update, including questions
      const { title, subject, duration, questions } = body;

      //  Delete old questions associated with the exam
      const oldExam = await Exam.findById(id);
      if (oldExam) {
        await Question.deleteMany({ _id: { $in: oldExam.questions } });
      }

      // Create and save new questions
      const questionIds = [];
      for (const q of questions) {
        const newQuestion = new Question(q);
        const savedQuestion = await newQuestion.save();
        questionIds.push(savedQuestion._id);
      }

      // Update the exam document with new questions and other data
      const updatedExam = await Exam.findByIdAndUpdate(
        id,
        {
          title,
          subject,
          durationInMinutes: duration,
          questions: questionIds,
        },
        { new: true, runValidators: true }
      ).populate('questions');

      if (!updatedExam) {
        return NextResponse.json({ message: "Exam not found" }, { status: 404 });
      }
      return NextResponse.json(updatedExam, { status: 200 });
    }
  } catch (error) {
    console.error('Error updating exam:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE handler to delete an exam and its questions
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    const examToDelete = await Exam.findById(id);

    if (!examToDelete) {
      return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

    await Exam.findByIdAndDelete(id);
    await Question.deleteMany({ _id: { $in: examToDelete.questions } });

    return NextResponse.json({ message: "Exam and all associated questions deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting exam and questions:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}