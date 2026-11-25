import {sql} from "@/lib/db";import {checkoutSchema} from "@/lib/validators";import {calculateCart,calculateCash,calculateTransfer} from "@/lib/money";import {NextResponse} from "next/server";import {errorResponse} from "@/lib/http";
export async function GET(){try{return NextResponse.json(await sql`SELECT * FROM sales ORDER BY created_at DESC LIMIT 500`)}catch(e){return errorResponse(e,500)}}
export async function POST(req:Request){try{
 const b=checkoutSchema.parse(await req.json());const calc=calculateCart(b.items,b.discount);if(calc.total<0||calc.discount!==b.discount)throw new Error("ส่วนลดไม่ถูกต้อง");
 const payment=b.payment_method==="Cash"?calculateCash(calc.total,b.received,b.donate_change):calculateTransfer(calc.total,b.received);
 const items=JSON.stringify(b.items);
 const rows=await sql`WITH valid_session AS (
   SELECT session_code FROM pos_sessions WHERE session_code=${b.session_code} AND status='CHECKING_OUT' FOR UPDATE
 ), item_lines AS (
   SELECT * FROM jsonb_to_recordset(${items}::jsonb) AS item(id uuid, quantity integer)
 ), stock_locked AS (
   SELECT p.id,p.stock FROM products p JOIN item_lines l ON p.id=l.id FOR UPDATE OF p
 ), stock_check AS (
   SELECT NOT EXISTS(SELECT 1 FROM item_lines l LEFT JOIN stock_locked p ON p.id=l.id WHERE p.id IS NULL OR (p.stock IS NOT NULL AND p.stock<l.quantity)) AS ok
 ), inserted AS (
   INSERT INTO sales(items_json,subtotal,discount,total,payment_method,received,change_amount,donation,idempotency_key)
   SELECT ${items}::jsonb,${calc.subtotal},${calc.discount},${calc.total},${b.payment_method},${payment.received},${payment.change_amount},${payment.donation},${b.idempotency_key}
   FROM valid_session,stock_check WHERE stock_check.ok ON CONFLICT(idempotency_key) DO NOTHING RETURNING *
 ), stock_update AS (
   UPDATE products p SET stock=p.stock-l.quantity FROM item_lines l,inserted i WHERE p.id=l.id AND p.stock IS NOT NULL RETURNING p.id
 ), session_update AS (
   UPDATE pos_sessions SET status='PAID',received=${payment.received},change_amount=${payment.change_amount},donation=${payment.donation},sale_id=inserted.id,updated_at=now()
   FROM inserted WHERE pos_sessions.session_code=${b.session_code} RETURNING inserted.*
 ) SELECT * FROM session_update`;
 if(rows.length)return NextResponse.json(rows[0],{status:201});
 const existing=await sql`SELECT * FROM sales WHERE idempotency_key=${b.idempotency_key}`;if(existing.length)return NextResponse.json(existing[0]);
 throw new Error("บันทึกการขายไม่สำเร็จ: สินค้าอาจมีจำนวนไม่พอ หรือ Session ไม่อยู่ในสถานะรอชำระเงิน");
 }catch(e){return errorResponse(e)}}
