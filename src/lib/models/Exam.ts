import mongoose, { Schema, Document } from "mongoose";

// A schema for individual questions, including an ID placeholder
// Note: We expect the Python API to populate these with question text, options, etc.
const QuestionSchema = new Schema({
    Q_ID: String,
    question: String,
    options: [String],
    // If you need to store the correct answer/solution inside the question object itself
    // you would add a field like: answer: String, here, but paper_solutions_map works too.
}, { _id: false });

// A schema for the entire question paper OBJECT structure
const QuestionPaperSchema = new Schema({
    MCQs: [QuestionSchema],
    Theory: [QuestionSchema],
    Coding: [QuestionSchema],
}, { _id: false }); 
// lib/models/exam.ts
import mongoose, { Schema } from "mongoose";

export interface IQuestion {
  text: string;
  type: "very_short" | "short" | "long" | "mcq" | "coding";
  marks?: number;
  options?: string[]; // for MCQ
  answer?: string;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true },
    type: { type: String, required: true },
    marks: { type: Number, default: 0 },
    options: [{ type: String }],
    answer: { type: String },
  },
  { _id: false }
);

const ExamSchema = new Schema(
    {
        title: { type: String, required: true },
        course: { type: String },
        subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
        facultyId: { type: String, required: true }, // Matches frontend useAuth hook
        duration: { type: Number, default: 180 }, // FIX: Name is 'duration'
        veryShort: { count: Number, difficulty: String },
        short: { count: Number, difficulty: String },
        long: { count: Number, difficulty: String },
        coding: { count: Number },
        instructions: { type: String },
        status: {
            type: String,
            enum: ["draft", "generated", "published"],
            default: "draft",
        },
        isPublished: { type: Boolean, default: false },

        // This field stores the structure of the question paper for display
        questions: QuestionPaperSchema,

        // This stores the map of Q_ID -> {type, question, correct_answer} from the Python API
        paper_solutions_map: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

const Exam = mongoose.models.Exam || mongoose.model("Exam", ExamSchema);

export default Exam;

const ExamSchema = new Schema(
  {
    title: { type: String, required: true },
    course: { type: String }, // e.g., B.Tech / BBA
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    facultyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    duration: { type: Number, default: 180 }, // minutes
    veryShort: {
      count: { type: Number, default: 0 },
      difficulty: { type: String, default: "easy" },
    },
    short: {
      count: { type: Number, default: 0 },
      difficulty: { type: String, default: "medium" },
    },
    long: {
      count: { type: Number, default: 0 },
      difficulty: { type: String, default: "hard" },
    },
    coding: {
      count: { type: Number, default: 0 },
    },
    instructions: { type: String },
    questions: [QuestionSchema], // generated or manually added questions
    status: {
      type: String,
      enum: ["draft", "generated", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const Exam =
  mongoose.models.Exam || mongoose.model("Exam", ExamSchema);

export default Exam;
