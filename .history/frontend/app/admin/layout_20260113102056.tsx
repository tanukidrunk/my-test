"use client";
import { ReactNode,useState,useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Book,
  List,
  User,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Books", href: "/admin/book", icon: Book },
    { name: "Category", href: "/admin/category", icon: List },
    { name: "Member", href: "/admin/memberlist", icon: User },
    { name: "Logout", href: "/login", icon: LogOut },
  ];

  return (
    <div className="min-h-screen flex bg-neutral-100 dark:bg-neutral-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-neutral-900 shadow-md p-4 border-r border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-bold mb-4 text-neutral-700 dark:text-neutral-200">
          Admin Menu
        </h2>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition
                  ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  }
                `}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
