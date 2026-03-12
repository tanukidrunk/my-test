'use client';
import { Search, UserX, Users } from 'lucide-react';
import MemberRow from './MemberRow';
import { Member } from './memberTypes';

type Props = {
  members: Member[];
  total: number;
  search: string;
  onSearchChange: (v: string) => void;
};
 
export default function MemberTable({ members, total, search, onSearchChange }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Card header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-400">
            <Users size={18} />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm tracking-tight">Members Directory</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              {members.length} of {total} total members
            </div>
          </div>
        </div>

        <div className="relative group">
          <Search 
            size={14} 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" 
          />
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="
              pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50
              text-sm text-slate-700 placeholder:text-slate-400 w-full sm:w-64
              focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400
              transition-all duration-200
            "
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {['ID', 'Member', 'Email', 'Gender'].map((h) => (
                <th 
                  key={h} 
                  className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {members.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 max-w-[300px] mx-auto">
                    {/* เปลี่ยน Emoji เป็น UserX Icon ในสไตล์ Shadcn */}
                    <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 ring-8 ring-slate-50/50">
                      <UserX size={32} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="font-bold text-slate-900 tracking-tight">No members found</div>
                      <div className="text-sm text-slate-500 leading-relaxed font-medium">
                        {search 
                          ? "We couldn't find any members matching your search." 
                          : "There are currently no members in the system."}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              members.map((m, i) => <MemberRow key={m.id} member={m} index={i} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Showing {members.length} members
        </span>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
             Live Database
           </span>
        </div>
      </div>
    </div>
  );
}