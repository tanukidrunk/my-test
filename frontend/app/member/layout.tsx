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
        relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
        transition-all duration-200 group
        ${active
          ? "text-[#f5f0e8] bg-white/10"
          : "text-[#a89f94] hover:text-[#f5f0e8] hover:bg-white/6"
        }
      `}
    >
      <span className={`text-base leading-none transition-all duration-200 ${active ? "opacity-100" : "opacity-50 group-hover:opacity-80"}`}>
        {icon}
      </span>
      {label}
      {active && (
        <span className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent rounded-full" />
      )}
    </Link>
  );
}

function UserBadge({ username, onLogout }: { username: string; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref  = useRef<HTMLDivElement>(null);

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
        className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl bg-white/8 hover:bg-white/14 border border-white/10 hover:border-white/20 transition-all duration-200"
      >
        {/* avatar */}
        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#c9a96e] to-[#a07840] flex items-center justify-center text-[11px] font-bold text-white tracking-wide flex-shrink-0">
          {initials}
        </span>
        <span className="text-sm font-medium text-[#f5f0e8] max-w-[120px] truncate">
          {username}
        </span>
        <span className={`text-[#a89f94] text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {/* dropdown */}
      {open && (
        <div className="
          absolute right-0 top-[calc(100%+8px)] w-44 z-50
          bg-[#1c1917] border border-white/12 rounded-xl shadow-2xl
          overflow-hidden
          animate-[dropIn_0.15s_ease-out]
        ">
          <div className="px-4 py-3 border-b border-white/8">
            <p className="text-xs text-[#6b6560] font-medium uppercase tracking-widest">Signed in as</p>
            <p className="text-sm text-[#f5f0e8] font-semibold truncate mt-0.5">{username}</p>
          </div>
          <div className="p-1.5">
            <Link
              href="/member/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-[#c4bdb6] hover:text-[#f5f0e8] hover:bg-white/8 transition-all duration-150"
            >
              <span className="text-base">◯</span> My Profile
            </Link>
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-[#c4bdb6] hover:text-red-400 hover:bg-red-500/8 transition-all duration-150"
            >
              <span className="text-base">⎋</span> Sign out
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
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
    <div className="min-h-screen flex flex-col bg-[#f7f5f2] font-[system-ui]">

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-40 border-b border-white/8"
        style={{ background: "rgba(15,13,11,0.96)", backdropFilter: "blur(12px)" }}
      >
        {/* gold hairline top */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a96e]/60 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* wordmark */}
          <Link href="/member/dashboard" className="flex items-center gap-3 flex-shrink-0 group">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a96e] to-[#7a5c35] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#c9a96e]/20 group-hover:shadow-[#c9a96e]/40 transition-all duration-300">
              ℒ
            </span>
            <span className="text-[#f5f0e8] font-semibold text-[15px] tracking-[-0.01em] hidden sm:block">
              Library
              <span className="text-[#6b6560] font-normal ml-1 text-xs uppercase tracking-widest">Member</span>
            </span>
          </Link>

          {/* nav */}
          <nav className="flex items-center gap-0.5">
            {NAV.map((n) => <NavLink key={n.href} {...n} />)}
          </nav>

          {/* user */}
          {ready ? (
            <UserBadge username={username} onLogout={handleLogout} />
          ) : (
            <div className="w-32 h-9 rounded-xl bg-white/6 animate-pulse" />
          )}
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#e8e4de] bg-[#f0ede8]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-[#9e998f]">
            © {new Date().getFullYear()} Library System
          </span>
          <span className="text-xs text-[#c4bdb6]">
            Member Portal
          </span>
        </div>
      </footer>
    </div>
  );
}