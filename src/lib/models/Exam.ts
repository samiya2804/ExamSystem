import mongoose, { Schema, Document, models } from "mongoose";
import { IQuestion } from "./Question"; 

export interface IExam extends Document {
  title: string;
  subject: string;
  durationInMinutes: number;
  date: Date;
  questions: IQuestion["_id"][]; // Array of Question IDs
  isPublished: boolean;
}

const ExamSchema = new Schema<IExam>({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  durationInMinutes: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question", required: true }],
  isPublished: { type: Boolean, default: false },
});

export default models.Exam || mongoose.model<IExam>("Exam", ExamSchema);