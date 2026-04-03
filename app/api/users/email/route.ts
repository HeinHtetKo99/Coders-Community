import User from "@/database/User.model";
import dbConnect from "@/lib/dbConnect";
import { handleSuccessRespone, handleErrorRespone } from "@/lib/response";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const user = await User.findOne({ email: body.email });
    if (!user) {
      throw new Error("User not found");
    }
    return handleSuccessRespone(user);
  } catch (e) {
    return handleErrorRespone(e);
  }
}
