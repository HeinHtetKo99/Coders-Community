import Account from "@/database/Account.model";
import dbConnect from "@/lib/dbConnect";
import { handleValidation } from "@/lib/handleValidation";
import { handleErrorRespone, handleSuccessRespone } from "@/lib/response";
import { accountSchema } from "@/lib/schemas/accountSchema";
import { Types } from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid account id");
    }
    const account = await Account.findById(id);
    if (!account) {
      throw new Error("Account not found");
    }
    return handleSuccessRespone(account);
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
      throw new Error("Invalid account id");
    }
    const account = await Account.findByIdAndDelete(id);
    if (!account) {
      throw new Error("Account not found");
    }
    return handleSuccessRespone(account);
  } catch (e) {
    return handleErrorRespone(e);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const validatedData = handleValidation(body, accountSchema, true);
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid account id");
    }
    const account = await Account.findByIdAndUpdate(id, validatedData, {
      new: true,
    });
    if (!account) {
      throw new Error("Account not found");
    }
    return handleSuccessRespone(account);
  } catch (e) {
    return handleErrorRespone(e);
  }
}
