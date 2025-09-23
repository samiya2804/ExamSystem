import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export async function GET(req: Request) {
  try {
    await connectDB();

    
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader
        .split(";")
        .map(c => c.trim().split("="))
        .map(([k, v]) => [k, decodeURIComponent(v)])
    );

    const token = cookies["exam_system_token"];
    if (!token) return NextResponse.json({ user: null });

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({ user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ user: null });
  }
}
