import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Exam from "@/lib/models/Exam";
import type { NextRequest } from "next/server";

function generateDummyQuestions(exam: any) {
  const questions: any[] = [];

  const pushMany = (count: number, type: string, marks: number) => {
    for (let i = 1; i <= count; i++) {
      questions.push({
        text: `${type.replace("_", " ").toUpperCase()} Q${i} — (${exam.title} / ${exam.subject?.name || exam.subject})`,
        type,
        marks,
        answer: `Model answer for ${type} Q${i}`,
      });
    }
  };

  pushMany(exam.veryShort?.count || 0, "very_short", 2);
  pushMany(exam.short?.count || 0, "short", 5);
  pushMany(exam.long?.count || 0, "long", 10);
  if (exam.coding?.count) pushMany(exam.coding.count, "coding", 15);

  return questions;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const exam = await Exam.findById(id).populate("subject", "name code");
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const generated = generateDummyQuestions(exam);

    exam.questions = generated;
    exam.status = "generated";
    await exam.save();

    const populated = await Exam.findById(id).populate("subject", "name code");
    return NextResponse.json(populated);
  } catch (err: any) {
    console.error("Generate exam error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
