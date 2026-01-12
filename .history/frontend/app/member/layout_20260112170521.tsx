"use client";

import { ReactNode,useState,useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import ProtectedLayout from "../../";

export default function MemberLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
   const [username, setUsername] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/member/profile`,{
             headers: {
            Authorization: `Bearer ${token}`,
          },
          }
        );

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const json = await res.json();
        setUsername(json.data.username);
      } catch {
        router.replace("/login");
      }
    };

    loadProfile();
  }, [router]);

    const handleLogout = async () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-purple-950 text-white p-4 shadow-md">
  <div className="max-w-6xl mx-auto flex justify-between items-center">
    <h1 className="text-xl font-bold">Library Member</h1>

    <nav className="flex gap-6 text-sm font-medium items-center">
      <Link href="/member/dashboard">Dashboard</Link>
      <Link href="/member/book">Books</Link>
      <Link href="/member/history">History Borrowed</Link>
      <Link href="/member/profile">Profile</Link>

      <button
        onClick={handleLogout}
        className="hover:text-yellow-300"
      >
        Logout
      </button>

      {username && (
        <span className="px-3 py-1 bg-white/25 rounded text-sm">
          {username}
        </span>
      )}
    </nav>
  </div>
</header>


     
      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        {children}
      </main>

     
      <footer className="bg-gray-200 text-gray-700 py-4 mt-auto">
        <div className="max-w-6xl mx-auto text-center text-sm">
          
        </div>
      </footer>
    </div>
  );
}
