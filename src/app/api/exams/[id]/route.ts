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
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params; // ✅ await params
    const data = await req.json();

    if (data.subject) {
      const s = await Subject.findById(data.subject);
      if (!s)
        return NextResponse.json(
          { error: "Subject not found" },
          { status: 400 }
        );
    }

    const updated = await Exam.findByIdAndUpdate(id, data, {
      new: true,
    }).populate("subject", "name code");

    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("Exam PUT error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
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
