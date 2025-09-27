import mongoose, { Schema, models } from "mongoose";

const SubjectSchema = new Schema(
  {
    name: { type: String, required: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
  },
  { timestamps: true }
);

const Subject = models.Subject || mongoose.model("Subject", SubjectSchema);
export default Subject;
