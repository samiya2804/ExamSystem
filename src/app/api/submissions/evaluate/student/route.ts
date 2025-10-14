// /app/api/submissions/evaluate/student/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission, { ISubmission } from "@/lib/models/Submission";
import ExamResult, { IExamResult } from "@/lib/models/ExamResult";
import axios from "axios";

const PYTHON_API_URL = `${process.env.NEXT_PUBLIC_EXAM_MODEL_URL}/api/v1/evaluate-submission`;  

type EvaluateRequest = {
  examId: string;
  studentId: string;
};

export async function POST(req: Request) {
  try {
    await connectDB();

    const { examId, studentId }: EvaluateRequest = await req.json();

    if (!examId || !studentId) {
      return NextResponse.json(
        { error: "Missing examId or studentId" },
        { status: 400 }
      );
    }

    console.log("📥 Evaluate request received:", { examId, studentId });

    // Fetch submission
    const submission = (await Submission.findOne({
      examId,
      studentId,
    }).lean()) as ISubmission | null;

    if (!submission) {
      return NextResponse.json(
        { error: "No submission found for given exam/student" },
        { status: 404 }
      );
    }

    // Prepare payload for AI model
    const payload = [
      {
        examId: submission.examId.toString(),
        studentId: submission.studentId.toString(),
        answers:
          submission.answers?.map((ans) => ({
            questionText: ans.questionText,
            studentAnswer: ans.studentAnswer,
            maximumScore: ans.marks ?? 10,
          })) || [],
      },
    ];

    console.log("📤 Sending payload to evaluator:", JSON.stringify(payload, null, 2));

    // Call Python AI evaluation API
    const response = await axios.post(PYTHON_API_URL, payload, { timeout: 120000 });
    const result = response.data;

    const report = result?.batch_evaluation_reports?.[0];
    if (!report) throw new Error("Invalid AI evaluation response — missing report");

    const summary = report.report_summary;
    const evaluationDetails = report.evaluation_details || [];

    const mappedEvaluationDetails = evaluationDetails.map((e: any) => ({
  questionText: e.question_text ?? "",
  scoreObtained: e.score_obtained ?? 0,
  maximumScore: e.maximum_score ?? 10,
  feedback: e.feedback ?? "",
}));
    console.log("✅ Received evaluation report:", {
      total_score_obtained: summary.total_score_obtained,
      total_max_score: summary.total_max_score,
      percentage_obtained: summary.percentage_obtained,
      evaluationDetails: mappedEvaluationDetails,
    });

    // Save to ExamResult collection
    const savedResult: IExamResult = await ExamResult.create({
  examId: submission.examId,
  studentId: submission.studentId,
  facultyId: submission.facultyId,
  totalMarksObtained: summary.total_score_obtained,
  totalMaxMarks: summary.total_max_score,
  percentage: summary.percentage_obtained,
  feedback: mappedEvaluationDetails.map((e: { feedback: string }) => e.feedback).join(" | "),
  evaluationDetails: mappedEvaluationDetails,
});


    // Update submission status
    await Submission.updateOne(
      { _id: submission._id },
      {
        $set: {
          status: "evaluated",
          evaluation_report: savedResult._id,
          total_score: summary.total_score_obtained,
          max_score: summary.total_max_score,
        },
      }
    );

    console.log("💾 Saved evaluation result:", savedResult._id);

    return NextResponse.json({ success: true, result: savedResult });
  } catch (err: any) {
    console.error("❌ Evaluation error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
