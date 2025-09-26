import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Department from "@/lib/models/department";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const dept = await Department.findById(params.id);
  return NextResponse.json(dept);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const data = await req.json();
  const updated = await Department.findByIdAndUpdate(params.id, data, {
    new: true,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await Department.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted" });
}
