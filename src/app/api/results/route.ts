import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/lib/models/Submission";

export async function GET(req: Request) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const studentId = url.searchParams.get("studentId");

        if (!studentId) {
            return NextResponse.json({ error: "Missing studentId query parameter" }, { status: 400 });
        }

        const results = await Submission.find({ 
            studentId,
            status: 'evaluated'
        })
        .sort({ createdAt: -1 })
        .populate({
            path: 'examId',
            select: 'title subject',
            populate: {
                path: 'subject',
                select: 'name code'
            }
        })
        .lean(); // ✅ use lean for plain JS objects

        const formattedResults = results.map(sub => ({
            _id: sub._id,
            subject: sub.examId?.subject || { name: "Unknown", code: "" }, // ✅ fallback
            student_id: sub.studentId,
            total_score: sub.total_score ?? 0,
            max_score: sub.max_score ?? 0,
            evaluation_details: sub.evaluation_report?.evaluation_details || [],
        }));

        return NextResponse.json(formattedResults);
    } catch (err: any) {
        console.error("Results GET error:", err);
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    }
}
