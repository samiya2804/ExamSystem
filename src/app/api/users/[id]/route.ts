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
export async function DELETE(req: Request) {
  try {
    await connectDB();

    // Extract id from URL manually
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // gets the [id] from /api/users/[id]

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/users/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}




