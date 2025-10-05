import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Exam from "@/lib/models/Exam";
import axios from "axios";

const PYTHON_API_URL = process.env.NEXT_PUBLIC_EXAM_MODEL_URL + "/api/v1/generate-paper";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const { params } = context; // ✅ Extract params here
  try {
    const examId = params.id;
    if (!examId) {
      return NextResponse.json({ error: "Exam ID is missing" }, { status: 400 });
    }

    await connectDB();
    const exam = await Exam.findById(examId).populate("subject", "name");
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const payload = {
      subject: exam.subject.name,
      topic: exam.title,
      difficulty: "medium",
      num_mcq: exam.veryShort.count,
      num_theory: exam.short.count + exam.long.count,
      num_coding: exam.coding.count,
    };

    const response = await axios.post(PYTHON_API_URL, payload);
    const generatedData = response.data;

    if (response.status !== 200 || !generatedData) {
      throw new Error("Failed to get a valid response from the generation API");
    }

    exam.questions = generatedData.full_paper_without_solutions;
    exam.paper_solutions_map = generatedData.paper_solutions_map;
    exam.status = "generated";

    const updatedExam = await exam.save();

    return NextResponse.json(updatedExam);

  } catch (err: any) {
    console.error("Generate API Error:", err.response ? err.response.data : err.message);
    const errorMessage = err.response ? err.response.data.detail : err.message || "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
