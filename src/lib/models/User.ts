import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: "student" | "faculty" | "admin";
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "faculty", "admin"], default: "student" },
  createdAt: { type: Date, default: Date.now },
});

export default models.User || mongoose.model<IUser>("User", UserSchema);
