import Account from "@/database/Account.model";
import dbConnect from "@/lib/dbConnect";
import { handleValidation } from "@/lib/handleValidation";
import { handleErrorRespone, handleSuccessRespone } from "@/lib/response";
import { accountSchema } from "@/lib/schemas/accountSchema";

export async function GET() {
  try {
    await dbConnect();
    const account = await Account.find();
    return handleSuccessRespone(account);
  } catch (e) {
    return handleErrorRespone(e);
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { provider, providerAccountId } = body;
    handleValidation(body, accountSchema);
    const existingAccount = await Account.findOne({
      provider,
      providerAccountId,
    });
    if (existingAccount) {
      throw new Error("Account already exists");
    }
    const newAccount = await Account.create(body);
    return handleSuccessRespone(newAccount, 201);
  } catch (e) {
    return handleErrorRespone(e);
  }
}
