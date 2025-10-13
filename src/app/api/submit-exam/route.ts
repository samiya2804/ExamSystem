
// app/api/submit-exam/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/lib/models/Submission"; // Assuming you created this model

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json(); // { examId, studentId, answers }

        if (!body.examId || !body.studentId || !body.answers) {
            return NextResponse.json({ error: "Missing submission data" }, { status: 400 });
        }

        const submission = await Submission.create({
            examId: body.examId,
            studentId: body.studentId,
            answers: body.answers,
            // total_score, max_score, evaluation_report will be set later by faculty
            status: 'pending_evaluation',
        });

        return NextResponse.json(submission, { status: 201 });
    } catch (err: any) {
        console.error("Submission POST error:", err);
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/lib/models/Submission";
import Exam from "@/lib/models/Exam";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { examId, studentId, answers } = body;

    if (!examId || !studentId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Missing required submission fields." },
        { status: 400 }
      );
    }

    console.log("📥 Received submission payload:", body);

    // Fetch exam
    const exam = await Exam.findById(examId);
    if (!exam) {
      return NextResponse.json({ error: "Exam not found." }, { status: 404 });
    }

    // Prevent duplicate submission
    const existing = await Submission.findOne({ examId, studentId });
    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted this exam." },
        { status: 409 }
      );
    }

    // Format answers and calculate total score & max score
    let totalScore = 0;
    let maxScore = 0;

    const formattedAnswers = answers.map((a: any) => {
      const marks = a.marks || 0;
      totalScore += marks; // We can update later if auto-grading is needed
      maxScore += marks;
      return {
        questionText: a.questionText,
        studentAnswer: a.studentAnswer,
        marks,
      };
    });

    // Create submission
    const submission = await Submission.create({
      examId,
      studentId,
      facultyId: exam.facultyId,
      subjectId: exam.subject, // store only ObjectId
      answers: formattedAnswers,
      total_score: totalScore,
      max_score: maxScore,
      status: "pending_evaluation",
    });

    console.log("✅ Submission saved successfully:", submission._id);

    return NextResponse.json(
      { message: "Exam submitted successfully!", submission },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("❌ Submission POST error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}

