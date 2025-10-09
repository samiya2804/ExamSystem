import { NextResponse } from "next/server";
import axios from 'axios';
import { connectDB } from "@/lib/db";
import Submission from "@/lib/models/Submission";
import Exam from "@/lib/models/Exam";

// IMPORTANT: Uses the environment variable from your .env
const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_EXAM_MODEL_URL || "http://127.0.0.1:8000";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }  // ✅ FIX: params must be awaited
) {
  const { id: submissionId } = await params;  

    try {
  await connectDB();
  console.log("✅ Hitting Evaluate API Route...");
console.log("Submission ID:", submissionId);

const studentSubmission = await Submission.findById(submissionId);
console.log("Fetched submission:", studentSubmission);

if (!studentSubmission) {
  console.log("❌ Submission not found in DB.");
  return NextResponse.json({ error: "Submission not found in database." }, { status: 404 });
}

const exam = await Exam.findById(studentSubmission.examId).select("paper_solutions_map");
console.log("Fetched exam:", exam?._id);
console.log("Exam paper_solutions_map keys:", exam?.paper_solutions_map ? Object.keys(exam.paper_solutions_map) : "none");

        if (!exam || !exam.paper_solutions_map) {
            // Critical error: Can't grade without the answer key.
            return NextResponse.json({ 
                error: "Answer key (paper_solutions_map) missing from exam. Generate paper first." 
            }, { status: 404 });
        }

        // 3. Construct the payload for the FastAPI
        const fastAPIPayload = {
            paper_solutions_map: exam.paper_solutions_map,
            student_submissions: [
                {
                    student_id: studentSubmission.studentId,
                    answers: studentSubmission.answers,
                },
            ],
        };

        // 4. Call the FastAPI evaluation endpoint
        const fastApiRes = await axios.post(
            `${FASTAPI_BASE_URL}/api/v1/evaluate-submission`, 
            fastAPIPayload,
            { timeout: 30000 } // Add a 30 second timeout for AI grading
        );
        
        // Check if FastAPI returned data and is structured as expected
        const report = fastApiRes.data?.student_results?.[0]; 
        if (!report || !report.total_score) {
            console.error("FastAPI returned invalid report structure:", fastApiRes.data);
            throw new Error("Invalid grading response from AI server.");
        }


        // 5. Update the Submission in the database with the result
        const updatedSubmission = await Submission.findByIdAndUpdate(submissionId, {
            total_score: report.total_score,
            max_score: report.max_score,
            status: 'evaluated',
            evaluation_report: report,
        }, { new: true });
        
        return NextResponse.json(updatedSubmission);
    } catch (err: any) {
        console.error("Evaluation POST error:", err);
        
        if (axios.isAxiosError(err)) {
            // This captures all network, timeout, or external server 4xx/5xx errors
            const status = err.response?.status;
            const detail = err.response?.data?.error || err.response?.data?.detail || err.message;
            
            // Return 502 Bad Gateway for external server errors
            return NextResponse.json({ 
                error: `AI Grading Failed (Status ${status}): ${detail}` 
            }, { status: 502 });
        }
        
        return NextResponse.json({ error: err.message || "Internal Server Error during evaluation process." }, { status: 500 });
    }
}
