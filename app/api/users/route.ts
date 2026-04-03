import User from "@/database/User.model";
import dbConnect from "@/lib/dbConnect";
import { handleValidation } from "@/lib/handleValidation";
import { handleErrorRespone, handleSuccessRespone } from "@/lib/response";
import { userSchema } from "@/lib/schemas/userSchema";

export async function GET() {
  try {
    await dbConnect();
    const user = await User.find();
    return handleSuccessRespone(user);
  } catch (e) {
    return handleErrorRespone(e);
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    handleValidation(body, userSchema);
    const existingEmail = await User.findOne({ email: body.email });
    if (existingEmail) {
      throw new Error("Email already exists");
    }
    const existingUsername = await User.findOne({ username: body.username });
    if (existingUsername) {
      throw new Error("Username already exists");
    }
    const user = await User.create(body);
    return handleSuccessRespone(user, 201);
  } catch (e) {
    return handleErrorRespone(e);
  }
}
