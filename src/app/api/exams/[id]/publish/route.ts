import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Temporary placeholder
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
