"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const iconProps = {
  className: "h-5 w-5 shrink-0",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.75,
  stroke: "currentColor",
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: "대시보드",
    icon: (
      <svg {...iconProps}>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/appointments",
    label: "예약관리",
    icon: (
      <svg {...iconProps}>
        <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
        <path strokeLinecap="round" d="M3.5 9.5h17M8 3v3M16 3v3" />
      </svg>
    ),
  },
  {
    href: "/customers",
    label: "환자관리",
    icon: (
      <svg {...iconProps}>
        <circle cx="9" cy="8" r="3.25" />
        <path strokeLinecap="round" d="M3.5 20c0-3.31 2.46-6 5.5-6s5.5 2.69 5.5 6" />
        <path strokeLinecap="round" d="M15.5 4.7a3.25 3.25 0 0 1 0 6.34M18.5 20c0-2.9-1.9-5.36-4.5-5.9" />
      </svg>
    ),
  },
  {
    href: "/inventory",
    label: "약재주문내역",
    icon: (
      <svg {...iconProps}>
        <path d="M3.5 8 12 3.5 20.5 8v8L12 20.5 3.5 16z" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 8 12 12.5 20.5 8M12 12.5V20.5" />
      </svg>
    ),
  },
  {
    href: "/payments",
    label: "매출관리",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path strokeLinecap="round" d="M9 9h5.5M9 12h5.5M12.5 9v7M9 15.5h5.5" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-zinc-200 bg-white px-4 py-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold text-white">
          호
        </span>
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          호호 한약국
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
