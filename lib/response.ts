import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const handleSuccessRespone = (data: unknown, status: number = 200) => {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
};

export const handleErrorRespone = (e: unknown) => {
  let message = e instanceof Error ? e.message : "Internal server error";
  let details = null;
  let status = 500;
  if (e instanceof ZodError) {
    details = e.flatten().fieldErrors;
    message = "Validation error";
    status = 400;
  }
  return NextResponse.json(
    {
      message,
      details,
      success: false,
      status,
    },
    { status }
  );
};

export const actionErrorResponse = (e: unknown) => {
  let message = e instanceof Error ? e.message : "Internal server error";
  let details = null;

  if (e instanceof ZodError) {
    details = e.flatten().fieldErrors;
    message = e.issues?.[0]?.message || "Validation failed";
  }
  return {
    message,
    details,
    success: false,
  };
};
