import type { Config } from "tailwindcss";
export default { content:["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}"], theme:{extend:{colors:{eco:{50:"#f1f8f2",100:"#dcefe0",200:"#b9dfc2",500:"#32834d",600:"#256b3d",700:"#1c5230",900:"#123821"}},boxShadow:{soft:"0 12px 35px rgba(18,56,33,.08)"}}},plugins:[]} satisfies Config;
