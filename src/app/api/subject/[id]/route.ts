import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subject from "@/lib/models/subject";
import Faculty from "@/lib/models/faculty";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const subject = await Subject.findById(params.id).populate("faculty", "name email department");
  return NextResponse.json(subject);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const data = await req.json();

  if (data.faculty) {
    const facultyExists = await Faculty.findById(data.faculty);
    if (!facultyExists) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 400 });
    }
  }

  const updated = await Subject.findByIdAndUpdate(params.id, data, { new: true }).populate(
    "faculty",
    "name email department"
  );
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await Subject.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted" });
}
