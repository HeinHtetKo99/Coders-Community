import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { rebuildAllUserReputations } from "@/lib/reputation/service";
import { handleErrorRespone, handleSuccessRespone } from "@/lib/response";

export async function POST(request: Request) {
  try {
    const configuredSecret = process.env.REPUTATION_REBUILD_SECRET;

    if (!configuredSecret) {
      throw new Error("REPUTATION_REBUILD_SECRET is not configured");
    }

    const providedSecret = request.headers.get("x-reputation-secret");

    if (providedSecret !== configuredSecret) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
          status: 401,
        },
        { status: 401 }
      );
    }

    await dbConnect();

    const result = await rebuildAllUserReputations();

    return handleSuccessRespone(result);
  } catch (error) {
    return handleErrorRespone(error);
  }
}
