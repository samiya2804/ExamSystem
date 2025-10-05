import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Exam from "@/lib/models/Exam";

// -------------------- PUT: Publish Exam --------------------
export async function PUT(req: NextRequest) {
  try {
    // Extract exam ID from URL
    const url = new URL(req.url);
    const examId = url.pathname.split("/").filter(Boolean).pop(); // last segment
    if (!examId) {
      return NextResponse.json({ error: "Exam ID is missing" }, { status: 400 });
    }

    await connectDB();

    const updatedExam = await Exam.findByIdAndUpdate(
      examId,
      { status: "published", isPublished: true },
      { new: true } // return updated document
    ).populate("subject", "name code");

    if (!updatedExam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Exam published successfully",
      exam: updatedExam,
    });
  } catch (err: any) {
    console.error("Publish API Error:", err.message);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

// -------------------- POST: Placeholder --------------------
export async function POST(req: NextRequest) {
  try {
    return NextResponse.json({
      message: "We are working on it 🚧",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
