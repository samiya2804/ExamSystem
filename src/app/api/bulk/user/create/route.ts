import mongoose, { Types } from "mongoose";
import User from "@/lib/models/User";
import Course from "@/lib/models/Course";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { studentIds, courseId } = body as {
      studentIds: string[];
      courseId: string;
    };

    // ✅ Validate input
    if (!Array.isArray(studentIds) || studentIds.length === 0 || !courseId) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid studentIds or courseId" }),
        { status: 400 }
      );
    }

    // ✅ Ensure course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
      });
    }

    // ✅ Convert IDs safely to ObjectId
    const objectIds: Types.ObjectId[] = studentIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // ✅ Perform bulk update (assign the same course to multiple users)
    const result = await User.bulkWrite(
      objectIds.map((id) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { course: course._id } }, // if one course per student
          // OR use $addToSet if users can have multiple courses:
          // update: { $addToSet: { courses: course._id } },
        },
      }))
    );

    console.log("✅ Bulk update result:", result);

    return new Response(
      JSON.stringify({
        message: "Courses assigned successfully",
        modifiedCount: result.modifiedCount,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error assigning courses:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
