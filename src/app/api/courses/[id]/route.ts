import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Course from "@/lib/models/Course";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await Course.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Course deleted" });
}
