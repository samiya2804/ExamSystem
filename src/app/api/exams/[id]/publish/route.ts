// app/api/exams/[id]/publish/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Exam from "@/lib/models/Exam";

export async function PUT(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    const exam = await Exam.findById(id);
    if (!exam) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (exam.status !== "generated") {
      return NextResponse.json({ error: "Generate the exam before publishing" }, { status: 400 });
    }

    exam.status = "published";
    await exam.save();

    const populated = await Exam.findById(id).populate("subject", "name code");
    return NextResponse.json(populated);
  } catch (err: any) {
    console.error("Publish exam error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
