// @/components/AdminLayoutSidebar.tsx
'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Book, List, User, LogOut } from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function AdminLayoutSidebar({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Books', href: '/admin/book', icon: Book },
    { name: 'Category', href: '/admin/category', icon: List },
    { name: 'Member', href: '/admin/memberlist', icon: User },
    { name: 'Logout', href: '/login', icon: LogOut, logout: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace('/login');
  };

  return (
    <div className='min-h-screen flex bg-neutral-100 dark:bg-neutral-950'>
      <aside className='w-64 bg-white dark:bg-neutral-900 shadow-sm p-4 border-r border-neutral-200 dark:border-neutral-800 sticky top-0 h-screen'>
        <div className='mb-8 px-2'>
          <h2 className='text-xs font-bold uppercase tracking-widest text-neutral-400'>
            Library System
          </h2>
          <p className='text-lg font-bold text-neutral-800 dark:text-white'>
            Admin Portal
          </p>
        </div>

        <nav className='space-y-1'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            if (item.logout) {
              return (
                <button
                  key={item.name}
                  onClick={handleLogout}
                  className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-auto'
                >
                  <Icon size={18} />
                  {item.name}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all',
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800',
                )}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className='flex-1 p-8 overflow-y-auto'>{children}</main>
    </div>
  );
}
