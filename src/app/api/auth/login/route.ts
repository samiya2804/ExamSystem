import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Email, password, and role are required" }, { status: 400 });
    }

    // Find user in DB
    const user = await User.findOne({ email, role });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or role" }, { status: 401 });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send JWT in HttpOnly cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user._id, email: user.email, role: user.role },
    });

    response.cookies.set({
      name: "exam_system_token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response;

  } catch (err: any) {
    console.error("Login Error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
