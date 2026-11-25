import {sql} from "@/lib/db";import {NextResponse} from "next/server";import {errorResponse} from "@/lib/http";
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;await sql`DELETE FROM products WHERE id=${id}`;return NextResponse.json({ok:true})}catch(e){return errorResponse(e)}}
