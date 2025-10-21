import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/lib/models/Submission";
import Exam from "@/lib/models/Exam";
import Subject from "@/lib/models/subject";
import ExamResult from "@/lib/models/ExamResult";

export async function GET(req: Request) {
  try {
    await connectDB();
    // Extract studentId from query params
  const url = new URL(req.url);
  const studentId = url.searchParams.get("studentId");

    if (!studentId) {
        return NextResponse.json(
        { error: "Missing student id." },
        { status: 400 }
      );
    }   
    

    const totalSubmissions = await Submission.countDocuments({ studentId });

    const lastExam = (await Submission.findOne({ studentId })
      .sort({ createdAt: -1 })
      .populate({
        path: "examId",
        select: "title subject",
        populate: { path: "subject", select: "name" },
      })
      .lean()) as any;

      // ✅ average score calculation
    const examResults = await ExamResult.find({ studentId }).lean();
    let avgScore = 0;
    if (examResults.length > 0) {
        console.log(`Found ${examResults.length} exam results for student ${studentId}.`);
      const totalScore = examResults.reduce(
        (sum, r) => sum + (r.totalMarksObtained || 0),
        0
      );
      const totalMax = examResults.reduce(
        (sum, r) => sum + (r.totalMaxMarks || 0),
        0
      );
      avgScore = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
    }else{
        console.log("No exam results found for average score calculation.");
    }


    return NextResponse.json({
      totalSubmissions,
      averageScore: avgScore.toFixed(2),
      lastExam: lastExam
        ? {
            examTitle: lastExam.examId?.title,
            subjectName: lastExam.examId?.subject?.name,
            total_score: lastExam.total_score,
            max_score: lastExam.max_score,
            createdAt: lastExam.createdAt,
          }
        : null,
    });
  } catch (err: any) {
    console.error("❌ Submission stats API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
