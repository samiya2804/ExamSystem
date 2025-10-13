import { NextResponse } from "next/server";
import UserModel from "@/lib/models/User";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const data = await req.json();
    const { firstName, lastName, email, role, status, password } = data;

    const updateData: any = { firstName, lastName, email, role, status };
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(params.id, updateData, { new: true });

    if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(updatedUser);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}


// delete a users 

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const deletedUser = await UserModel.findByIdAndDelete(params.id);
    if (!deletedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}



