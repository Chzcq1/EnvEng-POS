import { z } from "zod";
export const productSchema=z.object({
 name:z.string().trim().min(1).max(120),
 price:z.coerce.number().finite().min(0),
 image_url:z.string().url().nullable().optional().or(z.literal("")),
 category:z.string().trim().max(60).default("ทั่วไป"),
 stock:z.preprocess(v=>v===""||v===null?null:v,z.coerce.number().int().min(0).nullable().optional()),
 sku:z.string().trim().max(40).nullable().optional()
});
export const costSchema=z.object({description:z.string().trim().min(1).max(200),amount:z.coerce.number().finite().min(0)});
export const checkoutSchema=z.object({session_code:z.string().regex(/^\\d{4,6}$/),items:z.array(z.object({id:z.string().uuid(),name:z.string(),price:z.number().nonnegative(),quantity:z.number().int().positive()})).min(1),discount:z.number().nonnegative(),payment_method:z.enum(["Cash","Transfer"]),received:z.number().nonnegative(),donate_change:z.boolean().default(false),idempotency_key:z.string().min(10).max(100)});
