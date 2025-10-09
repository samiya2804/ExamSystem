// app/api/results/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Submission from "@/lib/models/Submission"; // Assuming you named your model Submission

export async function GET(req: Request) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const studentId = url.searchParams.get("studentId");

        if (!studentId) {
            // This case should ideally not happen if the front-end waits for user.id
            return NextResponse.json({ error: "Missing studentId query parameter" }, { status: 400 });
        }

        // Fetch all submissions/results for the given student ID
        // Note: You may need to populate the 'examId' to get the subject name, 
        // depending on how you structured your Submission model and how the UI uses 'subject'.
        const results = await Submission.find({ 
            studentId,
            status: 'evaluated' // Only show evaluated results
        })
        .sort({ createdAt: -1 })
        .populate({
            path: 'examId',
            select: 'title subject', // Select what you need from the Exam
            populate: {
                path: 'subject',
                select: 'name code' // Select what you need from the Subject
            }
        });

        // Map the results to match the 'Result' type expected by the frontend
        const formattedResults = results.map(sub => ({
            _id: sub._id,
            subject: sub.examId.subject, // Extracted via populate
            student_id: sub.studentId,
            total_score: sub.total_score,
            max_score: sub.max_score,
            evaluation_details: sub.evaluation_report?.evaluation_details || [],
        }));


        return NextResponse.json(formattedResults);
    } catch (err: any) {
        console.error("Results GET error:", err);
        // The frontend component expects a standard error structure
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    }
}