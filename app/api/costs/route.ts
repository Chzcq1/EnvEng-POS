import {sql} from "@/lib/db";import {costSchema} from "@/lib/validators";import {errorResponse} from "@/lib/http";import {NextResponse} from "next/server";
export async function GET(){try{return NextResponse.json(await sql`SELECT * FROM costs ORDER BY created_at DESC`)}catch(e){return errorResponse(e,500)}}
export async function POST(req:Request){try{const v=costSchema.parse(await req.json());const rows=await sql`INSERT INTO costs(description,amount) VALUES(${v.description},${v.amount}) RETURNING *`;return NextResponse.json(rows[0],{status:201})}catch(e){return errorResponse(e)}}
