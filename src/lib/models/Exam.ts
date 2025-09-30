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
