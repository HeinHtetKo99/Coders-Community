import User from "@/database/User.model";
import dbConnect from "@/lib/dbConnect";
import { handleValidation } from "@/lib/handleValidation";
import { handleErrorRespone, handleSuccessRespone } from "@/lib/response";
import { userSchema } from "@/lib/schemas/userSchema";
import { Types } from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user id");
    }
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return handleSuccessRespone(user);
  } catch (e) {
    return handleErrorRespone(e);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user id");
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error("User not found");
    }
    return handleSuccessRespone(user);
  } catch (e) {
    return handleErrorRespone(e);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = handleValidation(body, userSchema, true);
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user id");
    }
    const user = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
    });
    if (!user) {
      throw new Error("User not found");
    }
    return handleSuccessRespone(user);
  } catch (e) {
    return handleErrorRespone(e);
  }
}
