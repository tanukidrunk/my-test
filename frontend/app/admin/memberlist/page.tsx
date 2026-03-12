'use client';
import { useEffect, useState } from 'react';
import { UserRound, RefreshCw } from 'lucide-react';
import { apiFetch } from '@/app/lib/api/token';
import MemberStats from '@/components/Admin/memberlist/MemberStats';
import MemberTable from '@/components/Admin/memberlist/MemberTable';
import { Member }  from '@/components/Admin/memberlist/memberTypes';
  
export default function MemberPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [spinning, setSpinning] = useState(false);

const loadMembers = async () => {
  setLoading(true);
  setSpinning(true);

  try {
    const json = await apiFetch('/member');
    setMembers(Array.isArray(json.data) ? json.data : []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
    setTimeout(() => setSpinning(false), 600);
  }
};

  useEffect(() => { loadMembers(); }, []);

  const filtered = members.filter(
    (m) =>
      m.username.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Loading members…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* ── TOP BAR ── */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">People</div>
            <h1 className="flex items-center gap-2.5 text-3xl font-bold text-slate-800 mb-1">
              <UserRound size={26} className="text-blue-500" />
              Member Management
            </h1>
            <p className="text-slate-400 text-sm">Manage all registered members and their profiles</p>
          </div>
          <button
            onClick={loadMembers}
            className="
              flex-shrink-0 mt-1 flex items-center gap-2 px-4 py-2 rounded-xl
              border border-slate-200 bg-white text-sm font-medium text-slate-600
              hover:bg-slate-50 hover:border-slate-300
              transition-all duration-150 active:scale-95 shadow-sm
            "
          >
            <RefreshCw size={14} className={spinning ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* ── STATS ── */}
        <MemberStats members={members} />

        {/* ── TABLE ── */}
        <MemberTable
          members={filtered}
          total={members.length}
          search={search}
          onSearchChange={setSearch}
        />
      </div>
    </div>
  );
}