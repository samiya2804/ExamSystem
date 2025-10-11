import { NextResponse } from "next/server";
import axios from "axios";
import { connectDB } from "@/lib/db";
import Submission from "@/lib/models/Submission";
import Exam from "@/lib/models/Exam";

const FASTAPI_BASE_URL =
  process.env.NEXT_PUBLIC_EXAM_MODEL_URL || "http://127.0.0.1:8000";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: submissionId } = await params;

  try {
    await connectDB();
    console.log("✅ Evaluating submission:", submissionId);

    const studentSubmission = await Submission.findById(submissionId);
    if (!studentSubmission) {
      return NextResponse.json(
        { error: "Submission not found in database." },
        { status: 404 }
      );
    }

    const exam = await Exam.findById(studentSubmission.examId).select(
      "paper_solutions_map"
    );
    if (!exam) {
      return NextResponse.json(
        { error: "Exam not found or answer key missing." },
        { status: 404 }
      );
    }

    // ✅ Build payload according to FastAPI schema
    const fastAPIPayload = [
      {
        examId: studentSubmission.examId.toString(),
        studentId: studentSubmission.studentId.toString(),
        facultyId: studentSubmission.facultyId.toString(),
        answers: studentSubmission.answers.map((a: any) => ({
          questionText: a.questionText,
          studentAnswer: a.studentAnswer,
        })),
      },
    ];

    console.log("📦 Sending payload to FastAPI:", fastAPIPayload);

    // ✅ Send payload to FastAPI
    const response = await axios.post(
      `${FASTAPI_BASE_URL}/api/v1/evaluate-submission`,
      fastAPIPayload,
      { timeout: 30000 }
    );

    const result = response.data?.[0];
    if (!result) {
      throw new Error("Invalid response from evaluation model");
    }

    // ✅ Update Submission with results
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      {
        total_score: result.total_score,
        max_score: result.max_score,
        status: "evaluated",
        evaluation_report: result,
      },
      { new: true }
    );

    return NextResponse.json(updatedSubmission);
  } catch (err: any) {
    console.error("❌ Evaluation Error:", err);

    if (axios.isAxiosError(err)) {
      const status = err.response?.status || 502;
      const detail =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message;

      return NextResponse.json(
        { error: `AI Grading Failed (Status ${status}): ${detail}` },
        { status }
      );
    }

    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
