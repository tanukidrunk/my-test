'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
// ปรับเปลี่ยนไอคอนบางตัว: Library (Books), Tags (Category), Users (Member)
import { 
  LayoutDashboard, 
  Library, 
  Tags, 
  Users, 
  LogOut, 
  BookOpen 
} from 'lucide-react';
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
    { name: 'Books', href: '/admin/book', icon: Library }, // เปลี่ยนเป็น Library
    { name: 'Category', href: '/admin/category', icon: Tags }, // เปลี่ยนเป็น Tags
    { name: 'Member', href: '/admin/memberlist', icon: Users }, // เปลี่ยนเป็น Users
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace('/login');
  };

  return (
    <div className='min-h-screen flex bg-neutral-50 dark:bg-neutral-950'>
      <aside className='w-64 bg-white dark:bg-neutral-900 shadow-sm p-4 border-r border-neutral-200 dark:border-neutral-800 sticky top-0 h-screen flex flex-col'>
        
        {/* Logo Section */}
        <div className='mb-8 px-3 pt-2'>
          <div className='flex items-center gap-2 mb-2'>
            <div className='w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white'>
              <BookOpen size={18} strokeWidth={2.5} />
            </div>
            <h2 className='text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400'>
              Library System
            </h2>
          </div>
          <p className='text-xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
            Admin Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className='space-y-1.5 flex-1'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200',
                  active
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 dark:shadow-none'
                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-slate-900'
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button (Bottom) */}
        <div className='mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200'
          >
            <LogOut size={18} strokeWidth={2.5} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className='flex-1 p-8 overflow-y-auto'>
        <div className='max-w-6xl mx-auto'>
          {children}
        </div>
      </main>
    </div>
  );
}