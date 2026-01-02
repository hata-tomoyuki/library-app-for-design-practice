"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/dashboard",
      label: "書籍一覧",
      icon: "📚",
    },
    {
      href: "/dashboard/create",
      label: "書籍登録",
      icon: "➕",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black dark:text-zinc-50">
          図書館管理
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Library Management System
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black font-medium"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
