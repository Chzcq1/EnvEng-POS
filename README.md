# EnvEng Krathong POS — Dual-Screen Edition

ระบบ POS สำหรับกิจกรรมขายกระทงรักษ์โลก ใช้ Next.js App Router, TypeScript, Tailwind CSS, Neon PostgreSQL และ PromptPay QR

## 1) เตรียมระบบ
- Node.js 20.9+
- สร้าง Neon project แล้วรัน `schema.sql` ใน Neon SQL Editor
- คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ `DATABASE_URL` และ `PROMPTPAY_ID`

```bash
npm install
npm run dev
```
เปิด `http://localhost:3000` หน้าขายอยู่ที่ `/cashier` และจอลูกค้าอยู่ที่ `/display`

## 2) Dual-screen
1. เปิด `/cashier` แล้วกดสร้างรหัสจอลูกค้า
2. เปิด `/display` บนอุปกรณ์อีกเครื่องแล้วกรอกรหัสเดียวกัน
3. รหัสจะถูกเก็บใน localStorage และจอลูกค้าจะ poll สถานะทุก 750ms
4. เมื่อเริ่มคิดเงิน ระบบอัปเดต session เป็น CHECKING_OUT; เมื่อยืนยันชำระ ระบบบันทึก sale และเปลี่ยนเป็น PAID

## 3) การรับชำระ
- Cash: เลือกยอดรับเงิน/พิมพ์ยอดเอง ระบบคำนวณเงินทอน หรือยกยอดทอนเป็น donation
- Transfer: QR สร้างจาก PROMPTPAY_ID และยอดสุทธิ ผู้ปฏิบัติงานต้องตรวจสอบยอดเงินจริงในแอปธนาคารก่อนกดยืนยัน ยอดส่วนเกินบันทึกเป็น donation
- QR ไม่ใช่หลักฐานการรับชำระ และระบบนี้ยังไม่มี bank webhook/statement reconciliation

## 4) Deploy Vercel
1. Push repository ไป GitHub
2. Import project ใน Vercel
3. ตั้ง Environment Variables: `DATABASE_URL`, `PROMPTPAY_ID` (และค่าทางเลือกอื่น)
4. Deploy
5. เปิด `/products` เพิ่มสินค้าและ `/costs` ลงต้นทุนก่อนเริ่มขาย

## 5) ข้อควรทำก่อนใช้งานเงินจริง
- เพิ่ม Authentication/Role-based access และจำกัด API สำหรับ Admin/Cashier; เวอร์ชันนี้เหมาะกับเครือข่ายกิจกรรมที่ควบคุมอุปกรณ์และผู้ใช้ได้เท่านั้น
- เพิ่ม reconciliation กับหลักฐานโอนเงินจริง; อย่าถือว่าการกด confirm คือการตรวจสอบจากธนาคาร
- ทำ backup Neon และทดสอบอุปกรณ์/เครือข่าย/เครื่องพิมพ์ก่อนเปิดขาย
- Polling 750ms ทำงานได้สำหรับงานอีเวนต์ขนาดเล็กถึงกลาง แต่หากมีจอจำนวนมากควรเปลี่ยนเป็น SSE/WebSocket หรือเพิ่ม polling interval
- `costs` เป็นยอดค่าใช้จ่ายรวม; การคำนวณ break-even แบบจำนวนชิ้นต้องมีต้นทุนคงที่และต้นทุนผันแปรต่อ SKU จึงยังไม่แสดงค่าประมาณที่ทำให้เข้าใจผิด

## 6) API
- `GET/POST /api/products`, `DELETE /api/products/:id`
- `GET/POST /api/costs`, `DELETE /api/costs/:id`
- `POST /api/pair`
- `GET/PATCH /api/sessions/:code`, `POST /api/sessions/:code/reset`
- `POST /api/qr`
- `GET/POST /api/sales`
- `POST /api/void`
- `GET /api/dashboard`

## 7) Notes
ระบบใช้ parameterized SQL ผ่าน Neon serverless driver. การยืนยันขายใช้ unique `idempotency_key` และฐานข้อมูลบังคับ unique constraint. ควรเพิ่ม authentication, audit log สำหรับ void, และ server-side session ownership ก่อนใช้ในงานที่มีความเสี่ยงสูง.
