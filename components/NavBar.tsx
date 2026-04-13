"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "ダッシュボード" },
  { href: "/submissions", label: "提出チェック" },
  { href: "/students", label: "生徒管理" },
  { href: "/assignments", label: "課題管理" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-6 h-14">
          <span className="font-bold text-lg tracking-wide mr-2">📋 提出物チェック</span>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium px-3 py-1.5 rounded transition-colors ${
                pathname === item.href
                  ? "bg-white text-indigo-700"
                  : "text-indigo-100 hover:text-white hover:bg-indigo-500"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
