"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/app/lib/api/token";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [verified, setVerified] = useState(false); // ✅ เพิ่ม state

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (!res.ok) {
        router.push("/login");
      } else {
        setVerified(true); // ✅ render children เมื่อผ่านแล้วเท่านั้น
      }
    }).catch(() => {
      router.push("/login");
    });
  }, [router]);

  // ✅ block render จนกว่าจะ verify เสร็จ
  if (!verified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}