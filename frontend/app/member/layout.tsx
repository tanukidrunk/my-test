"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch, getToken, removeToken } from "@/app/lib/api/token";

/* ─── nav items ─────────────────────────────────────────────────── */
const NAV = [
  { href: "/member/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/member/book",      label: "Browse",    icon: "◫" },
  { href: "/member/profile",   label: "Profile",   icon: "◯" },
] as const;

/* ─── sub-components ─────────────────────────────────────────────── */
function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  const pathname = usePathname();
  const active   = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium
        transition-all duration-300
        ${active
          ? "text-[#1a1614] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] shadow-inner"
          : "text-[#8a8480] hover:text-[#1a1614] hover:bg-white/60"
        }
      `}
    >
      <span className={`text-base leading-none transition-all duration-200 ${active ? "opacity-100" : "opacity-40 group-hover:opacity-70"}`}>
        {icon}
      </span>
      {label}
      {active && (
        <span className="absolute bottom-1.5 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/50 to-transparent rounded-full" />
      )}
    </Link>
  );
}

function UserBadge({ username, onLogout }: { username: string; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.07)] border border-[#ece8e2] hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] hover:border-[#ddd8d0] transition-all duration-300"
      >
        <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#c9a96e] to-[#a07840] flex items-center justify-center text-[11px] font-bold text-white tracking-wide flex-shrink-0 shadow-sm">
          {initials}
        </span>
        <span className="text-sm font-semibold text-[#1a1614] max-w-[120px] truncate">
          {username}
        </span>
        <span className={`text-[#b8b2ab] text-[10px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="
          absolute right-0 top-[calc(100%+10px)] w-48 z-50
          bg-white/95 backdrop-blur-xl border border-[#ece8e2]
          rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)]
          overflow-hidden
          animate-[dropIn_0.18s_cubic-bezier(0.34,1.56,0.64,1)]
        ">
          <div className="px-4 py-3.5 border-b border-[#f0ece6]">
            <p className="text-[10px] text-[#b8b2ab] font-semibold uppercase tracking-widest">Signed in as</p>
            <p className="text-sm text-[#1a1614] font-semibold truncate mt-0.5">{username}</p>
          </div>
          <div className="p-2">
            <Link
              href="/member/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-[#4a4642] hover:text-[#1a1614] hover:bg-[#f7f5f2] transition-all duration-150"
            >
              <span className="text-base opacity-60">◯</span> My Profile
            </Link>
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-[#4a4642] hover:text-red-500 hover:bg-red-50 transition-all duration-150"
            >
              <span className="text-base opacity-60">⎋</span> Sign out
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)   scale(1);     }
        }
      `}</style>
    </div>
  );
}

/* ─── main layout ────────────────────────────────────────────────── */
export default function MemberLayout({ children }: { children: ReactNode }) {
  const router   = useRouter();
  const [username, setUsername] = useState("");
  const [ready,    setReady]    = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const token = getToken();
      if (!token) { router.replace("/login"); return; }
      try {
        const res = await apiFetch("/member/profile");
        setUsername(res.data.username);
        setReady(true);
      } catch {
        removeToken();
        router.replace("/login");
      }
    };
    loadProfile();
  }, [router]);

  const handleLogout = async () => {
    try { await apiFetch("/member/logout", { method: "POST" }); } catch {}
    removeToken();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen flex flex-col font-[system-ui]"
      style={{
        background: "linear-gradient(160deg, #f8f7f4 0%, #f2efe9 40%, #ede9e2 100%)",
      }}
    >
      {/* ── subtle cloud texture overlay ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 10% 0%, rgba(255,255,255,0.7) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 100%, rgba(255,255,255,0.5) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)
          `,
          zIndex: 0,
        }}
      />

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-40 border-b border-[#e8e3da]/80"
        style={{
          background: "rgba(252,250,247,0.85)",
          backdropFilter: "blur(20px) saturate(1.4)",
          WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* wordmark */}
          <Link href="/member/dashboard" className="flex items-center gap-3 flex-shrink-0 group">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#c9a96e] to-[#7a5c35] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#c9a96e]/25 group-hover:shadow-[#c9a96e]/40 group-hover:scale-105 transition-all duration-300">
              ℒ
            </span>
            <span className="text-[#1a1614] font-semibold text-[15px] tracking-[-0.01em] hidden sm:block">
              Library
              <span className="text-[#b8b2ab] font-normal ml-1.5 text-[11px] uppercase tracking-widest">Member</span>
            </span>
          </Link>

          {/* nav pill container */}
          <nav className="flex items-center gap-1 bg-[#f0ece6]/70 rounded-2xl p-1 border border-[#e8e3da]/60 shadow-inner shadow-[#00000008]">
            {NAV.map((n) => <NavLink key={n.href} {...n} />)}
          </nav>

          {/* user */}
          {ready ? (
            <UserBadge username={username} onLogout={handleLogout} />
          ) : (
            <div className="w-36 h-10 rounded-2xl bg-white/70 border border-[#ece8e2] animate-pulse" />
          )}
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="relative flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8" style={{ zIndex: 1 }}>
        {children}
      </main>

      {/* ── FOOTER ── */}
      <footer className="relative border-t border-[#e8e3da]/60 z-10"
        style={{ background: "rgba(240,237,232,0.7)", backdropFilter: "blur(8px)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-[#b8b2ab]">
            © {new Date().getFullYear()} Library System
          </span>
          <span className="text-xs text-[#c8c2ba]">
            Member Portal
          </span>
        </div>
      </footer>
    </div>
  );
}