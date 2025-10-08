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