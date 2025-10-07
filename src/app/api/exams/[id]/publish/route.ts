import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Exam from "@/lib/models/Exam";


export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
  try {
    const examId = params.id;
    if (!examId) {
      return NextResponse.json({ error: "Exam ID is missing" }, { status: 400 });
    }

    await connectDB();
    
    // Find the exam and update its status to 'published'
    const updatedExam = await Exam.findByIdAndUpdate(
<<<<<<< Updated upstream
        examId,
        { status: "published", isPublished: true },
        { new: true } // This option returns the updated document
=======
      examId,
      { status: "published", isPublished: true , publishedAt: new Date() },
      { new: true } // return updated document
>>>>>>> Stashed changes
    ).populate("subject", "name code");

    if (!updatedExam) {
        return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json(updatedExam);

  } catch (err: any) {
    console.error("Publish API Error:", err.message);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}


//How to Get Started**

//1.  **Replace your files:** Copy the code above and replace the content of your placeholder `route.ts` files.
//2.  **Run Both Servers:** For this to work, you must have both your Python backend and your Next.js frontend running at the same time.
    //* **Terminal 1 (Python Backend):**
        //```bash
      //  # Navigate to your Python project folder
      //  python -m uvicorn main:app --reload
        //```
   // * **Terminal 2 (Next.js Frontend):**
     //```bash
    //    # Navigate to your Next.js project folder
     //     npm run dev
      
