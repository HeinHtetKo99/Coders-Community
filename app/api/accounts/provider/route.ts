import Account from "@/database/Account.model";
import dbConnect from "@/lib/dbConnect";
import { handleSuccessRespone, handleErrorRespone } from "@/lib/response";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { providerAccountId } = await req.json();
    const account = await Account.findOne({ providerAccountId });
    if (!account) {
      throw new Error("Account not found");
    }
    return handleSuccessRespone(account);
  } catch (e) {
    return handleErrorRespone(e);
  }
}
