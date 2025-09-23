import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { firstName, lastName, username, email, password, role } = body;

    // check existing
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json({ 
      message: "User registered successfully",
      user: { id: newUser._id, email: newUser.email, role: newUser.role } 
    });
  } catch (err: any) {
    console.error("Signup Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
