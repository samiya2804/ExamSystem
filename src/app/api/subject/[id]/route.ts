import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subject from "@/lib/models/subject";
import Faculty from "@/lib/models/faculty";

export async function GET(req: Request) {
  await connectDB();
  const id = req.url.split("/").pop(); // extract ID from URL
  const subject = await Subject.findById(id).populate("faculty", "name email department");
  return NextResponse.json(subject);
}

export async function PUT(req: Request) {
  await connectDB();
  const id = req.url.split("/").pop(); // extract ID from URL
  const data = await req.json();

  if (data.faculty) {
    const facultyExists = await Faculty.findById(data.faculty);
    if (!facultyExists) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 400 });
    }
  }

  const updated = await Subject.findByIdAndUpdate(id, data, { new: true }).populate(
    "faculty",
    "name email department"
  );
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  await connectDB();
  const id = req.url.split("/").pop(); // extract ID from URL
  await Subject.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}