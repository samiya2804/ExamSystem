// app/api/exams/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Exam from "@/lib/models/Exam";
import Subject from "@/lib/models/subject";

// GET exam by ID
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params; // ✅ await params
    const exam = await Exam.findById(id).populate("subject", "name code");
    if (!exam)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(exam);
  } catch (err: any) {
    console.error("Exam GET error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

// UPDATE exam
export async function PUT(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const seg = url.pathname.split("/").filter(Boolean);
    const examId = seg[seg.length - 1]; // when this file is at /api/exams/[id]

    const body = await req.json();

    // Only allow specific updates (questions, paper_solutions_map, status, etc.)
    const allowed: any = {};
    if (body.questions) allowed.questions = body.questions;
    if (body.paper_solutions_map) allowed.paper_solutions_map = body.paper_solutions_map;
    if (body.status) allowed.status = body.status;
    if (typeof body.isPublished !== "undefined") allowed.isPublished = body.isPublished;

    const updated = await Exam.findByIdAndUpdate(examId, allowed, { new: true }).populate("subject", "name code");
    if (!updated) return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("Exam PUT error:", err);
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}

// DELETE exam
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params; // ✅ await params
    await Exam.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err: any) {
    console.error("Exam DELETE error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
