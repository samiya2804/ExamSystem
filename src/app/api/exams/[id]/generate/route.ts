import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Exam from "@/lib/models/Exam";
import axios from "axios";

// Use environment variable for Python API
const PYTHON_API_URL = process.env.NEXT_PUBLIC_EXAM_MODEL_URL + "/api/v1/generate-paper";

export async function POST(req: NextRequest) {
  try {
    // Extract exam ID from the URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").filter(Boolean).pop(); // gets the last segment
    if (!id) {
      return NextResponse.json({ error: "Exam ID is missing" }, { status: 400 });
    }

    // 1. Connect to DB
    await connectDB();

    // 2. Find the exam
    const exam = await Exam.findById(id).populate("subject", "name");
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    // 3. Prepare payload
    const payload = {
      subject: exam.subject.name,
      topic: exam.title,
      difficulty: "medium",
      num_mcq: exam.veryShort?.count || 0,
      num_theory: (exam.short?.count || 0) + (exam.long?.count || 0),
      num_coding: exam.coding?.count || 0,
    };

    // 4. Call Python API
    const response = await axios.post(PYTHON_API_URL, payload);
    const generatedData = response.data;

    if (response.status !== 200 || !generatedData) {
      throw new Error("Failed to get a valid response from the generation API");
    }

    // 5. Update exam
    exam.questions = generatedData.full_paper_without_solutions;
    exam.paper_solutions_map = generatedData.paper_solutions_map;
    exam.status = "generated";

    const updatedExam = await exam.save();

    return NextResponse.json(updatedExam);
  } catch (err: any) {
    console.error("Generate API Error:", err.response?.data || err.message);
    const errorMessage = err.response?.data?.detail || err.message || "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
