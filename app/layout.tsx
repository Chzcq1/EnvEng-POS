import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, LayoutDashboard, ShoppingCart, ReceiptText, Package, Wallet, Monitor } from "lucide-react";
import "./globals.css";
export const metadata:Metadata={title:"Envi DIY POS",description:"ระบบขายสินค้าและจัดการร้าน Envi DIY"};
const links=[{href:"/cashier",label:"ขายสินค้า",Icon:ShoppingCart},{href:"/dashboard",label:"ภาพรวม",Icon:LayoutDashboard},{href:"/history",label:"รายการขาย",Icon:ReceiptText},{href:"/products",label:"สินค้า",Icon:Package},{href:"/costs",label:"ค่าใช้จ่าย",Icon:Wallet},{href:"/display",label:"จอลูกค้า",Icon:Monitor}];
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="th"><body><header className="app-header"><Link href="/cashier" className="brand"><span className="brand-mark"><Leaf size={21}/></span><span>Envi <b>DIY</b><small>POINT OF SALE</small></span></Link><nav className="main-nav">{links.map(({href,label,Icon})=><Link className="navlink" href={href} key={href}><Icon size={18}/><span>{label}</span></Link>)}</nav></header><main className="app-main">{children}</main></body></html>}