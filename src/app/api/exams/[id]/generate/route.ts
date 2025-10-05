import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Exam from "@/lib/models/Exam";
import axios from "axios";

// This function handles the POST request when you click the "Play" button.
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const examId = params.id;
    if (!examId) {
      return NextResponse.json({ error: "Exam ID is missing" }, { status: 400 });
    }

    // 1. Connect to DB and find the exam configuration
    await connectDB();
    const exam = await Exam.findById(examId).populate("subject", "name");
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    // 2. Prepare the payload for your Python API
    const payload = {
      subject: exam.subject.name,
      topic: exam.title,
      difficulty: "medium", // You can make this dynamic later
      num_mcq: exam.veryShort.count,
      num_theory: exam.short.count + exam.long.count,
      num_coding: exam.coding.count,
    };

    // 3. Call your Python backend API
    // ✅ FIX: Removed "/docs" from the URL
    const pythonApiUrl = "http://127.0.0.1:8000/api/v1/generate-paper";
    const response = await axios.post(pythonApiUrl, payload);
    const generatedData = response.data;

    if (response.status !== 200 || !generatedData) {
        throw new Error("Failed to get a valid response from the generation API");
    }

    // 4. Update the exam in the database with the generated questions and solutions
    exam.questions = generatedData.full_paper_without_solutions;
    exam.paper_solutions_map = generatedData.paper_solutions_map; // Store the answers separately
    exam.status = "generated";
    
    const updatedExam = await exam.save();
    
    // Return the fully updated exam to the frontend
    return NextResponse.json(updatedExam);

  } catch (err: any) {
    console.error("Generate API Error:", err.response ? err.response.data : err.message);
    const errorMessage = err.response ? err.response.data.detail : err.message || "Server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

