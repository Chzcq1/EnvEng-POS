import { NextResponse } from "next/server";
export function errorResponse(error:unknown,status=400){const message=error instanceof Error?error.message:"เกิดข้อผิดพลาดภายในระบบ";return NextResponse.json({error:message},{status});}
