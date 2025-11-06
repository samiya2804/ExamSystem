import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission, { ISubmission } from "@/lib/models/Submission";
import ExamResult, { IExamResult } from "@/lib/models/ExamResult";
import axios from "axios";

const PYTHON_API_URL = "http://127.0.0.1:8000/api/v1/evaluate-submission";

type EvaluateRequest = {
  examId: string;
  studentIds: string[];
};

export async function POST(req: Request) {
  try {
    await connectDB();
    const { examId, studentIds }: EvaluateRequest = await req.json();

    if (!examId || !Array.isArray(studentIds) || studentIds.length === 0) {
      console.log("❌ Invalid input:", { examId, studentIds });
      return NextResponse.json({ error: "Missing or invalid input" }, { status: 400 });
    }

    console.log("📥 Bulk evaluate request:", { examId, totalStudents: studentIds.length });

    // 🔍 Fetch all submissions for selected students
    const submissions = (await Submission.find({
      examId,
      studentId: { $in: studentIds },
    }).lean()) as unknown as ISubmission[];

    if (submissions.length === 0) {
      return NextResponse.json({ error: "No submissions found" }, { status: 404 });
    }

    // 🗺️ Map facultyId for later use
    const facultyMap = submissions.reduce((acc, s) => {
      acc[s.studentId.toString()] = s.facultyId?.toString() || null;
      return acc;
    }, {} as Record<string, string | null>);

    // 🧩 Prepare payload for Python model (EXACT structure you mentioned)
    const payload = submissions.map((sub) => ({
      examId: sub.examId.toString(),
      studentId: sub.studentId.toString(),
      answers:
        sub.answers?.map((ans) => ({
          questionText: ans.questionText,
          studentAnswer: ans.studentAnswer,
          maximumScore: ans.marks ?? 10,
        })) || [],
    }));

    console.log("📤 Sending payload to AI model:", JSON.stringify(payload, null, 2));

    // ⚙️ Send to Python model API
    const response = await axios.post(PYTHON_API_URL, payload, { timeout: 180000 });
    const data = response.data;

    const reports = data?.batch_evaluation_reports || [];

    if (!reports.length) {
      throw new Error("Invalid response — no batch_evaluation_reports found");
    }

    const savedResults: IExamResult[] = [];

    // 🧾 Save results to MongoDB
    for (const report of reports) {
      const summary = report.report_summary;
      if (!summary) continue;

      const facultyId = facultyMap[summary.student_id];
      if (!facultyId) {
        console.warn(`⚠️ Missing facultyId for student ${summary.student_id}`);
        continue;
      }

      const savedResult = await ExamResult.create({
        examId: summary.exam_id,
        studentId: summary.student_id,
        facultyId,
        totalMarksObtained: summary.total_score_obtained,
        totalMaxMarks: summary.total_max_score,
        percentage: summary.percentage_obtained,
        feedback: summary.overall_feedback,
        strengths: summary.collective_strengths || [],
        weaknesses: summary.collective_weaknesses || [],
      });

      // 🛠️ Update submission status
      await Submission.updateOne(
        { examId: summary.exam_id, studentId: summary.student_id },
        {
          $set: {
            status: "evaluated",
            evaluation_report: savedResult._id,
            total_score: summary.total_score_obtained,
            max_score: summary.total_max_score,
          },
        }
      );

      savedResults.push(savedResult);
    }

    console.log("✅ Bulk evaluation complete:", savedResults.length, "students");

    // Prepare readable result summary for frontend
const studentResults = reports.map((r: any) => {
  const s = r.report_summary;
  return {
    examId: s.exam_id,
    studentId: s.student_id,
    totalQuestions: s.total_questions_evaluated,
    totalMarksObtained: s.total_score_obtained,
    totalMaxMarks: s.total_max_score,
    percentage: s.percentage_obtained,
    feedback: s.overall_feedback,
    strengths: s.collective_strengths || [],
    weaknesses: s.collective_weaknesses || [],
  };
});

return NextResponse.json({
  success: true,
  totalEvaluated: studentResults.length,
  results: studentResults,
});

  } catch (err: any) {
    console.error("❌ Bulk evaluation error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
