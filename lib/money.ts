export type CartItem = { id:string; name:string; price:number; quantity:number; image_url?:string|null };
export const money = (n:number) => Math.round((n + Number.EPSILON) * 100) / 100;
export function calculateCart(items:CartItem[], discount:number) {
 const subtotal = money(items.reduce((s,i)=>s + i.price*i.quantity,0));
 const safeDiscount = money(Math.min(Math.max(0, discount), subtotal));
 return {subtotal, discount:safeDiscount, total:money(subtotal-safeDiscount)};
}
export function calculateCash(total:number, received:number, donateChange:boolean) {
 const safeReceived=money(Math.max(0,received));
 if(safeReceived < total) throw new Error("เงินที่รับมายังไม่ครบ");
 const rawChange=money(safeReceived-total);
 return {received:safeReceived, change_amount:donateChange?0:rawChange, donation:donateChange?rawChange:0};
}
export function calculateTransfer(total:number, received:number) {
 const safeReceived=money(Math.max(0,received));
 if(safeReceived < total) throw new Error("ยอดโอนที่ยืนยันต้องไม่น้อยกว่ายอดสุทธิ");
 return {received:safeReceived, change_amount:0, donation:money(safeReceived-total)};
}
