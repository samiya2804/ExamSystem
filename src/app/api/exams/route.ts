// src/app/api/exams/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import Exam from '@/lib/models/Exam';
// NOTE: Since the new model uses embedded documents for 'questions',
// we no longer need to import Question model here for the initial save.
// import Question from '@/lib/models/Question'; 

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        // Destructure all expected fields. 'questions' and 'paper_solutions_map' will be undefined
        // during initial exam creation from the form.
        const { title, subject, duration, questions, paper_solutions_map, ...examDetails } = body;

        // FIX 1: Handle initial exam creation where 'questions' is undefined.
        // If questions is present and is an array/object, it means we are trying to save questions
        // which should ideally happen on a separate GENERATE or UPDATE route.
        // For initial creation, we skip any question saving logic.

        // We are no longer trying to save separate Question documents or gather IDs.
        // The structure is now designed for an embedded QuestionPaper.

        // Initialize question fields to empty if not provided in the payload
        const initialQuestions = questions || {};
        const initialSolutions = paper_solutions_map || {};

        // 2. Create the exam document
        const newExam = new Exam({
            title,
            subject,
            duration: duration, // FIX 3: Corrected field name to 'duration'
            questions: initialQuestions, // Initialize with empty object or the structure if provided
            paper_solutions_map: initialSolutions,
            ...examDetails, // Include course, facultyId, veryShort, short, long, coding, instructions, etc.
        });

        const savedExam = await newExam.save();
        return NextResponse.json(savedExam, { status: 201 });

    } catch (error) {
        console.error('Error creating exam:', error);
        // FIX 4: Improve error response to show the specific error (useful for debugging)
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: `Error creating exam: ${errorMessage}` }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const facultyId = searchParams.get('facultyId');

        let query = {};
        if (facultyId) {
            query = { facultyId: facultyId };
        }

        // NOTE: populate('questions') is unnecessary and incorrect because 'questions' is an embedded sub-document, not a reference.
        // Only populate('subject') is needed if you want the subject name/code.
        const exams = await Exam.find(query).populate('subject').sort({ createdAt: -1 });

        return NextResponse.json(exams, { status: 200 });

    } catch (error) {
        console.error('Error fetching exams:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
