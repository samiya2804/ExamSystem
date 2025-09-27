import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subject from "@/lib/models/subject";
import Faculty from "@/lib/models/faculty";

export async function GET() {
  await connectDB();
  const subjects = await Subject.find().populate("faculty", "name email department");
  return NextResponse.json(subjects);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();

  try {
    // Ensure faculty exists
    const faculty = await Faculty.findById(data.faculty);
    if (!faculty) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 400 });
    }

    const subject = await Subject.create(data);
    const populated = await subject.populate("faculty", "name email department");
    return NextResponse.json(populated, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
