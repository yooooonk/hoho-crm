import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "호호 한약국 CRM",
  description: "호호 한약국 고객/상담/예약/재고/매출 관리",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full bg-zinc-50 dark:bg-zinc-950">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
