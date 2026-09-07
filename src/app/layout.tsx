import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "호호 한약국 CRM",
  description: "호호 한약국 고객/상담/예약/재고/매출 관리",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
