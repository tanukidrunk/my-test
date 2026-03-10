'use client';
import { Mail, IdCard, BadgeCheck } from 'lucide-react';
import { MemberProfile } from './profileTypes';

type Props = { member: MemberProfile };

export default function ProfileAccountInfo({ member }: Props) {
  return (
    <div className="px-6 mb-6">
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">
        Account Information
      </div>
      
      <div className="space-y-3">
        {/* Email Card */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Mail size={20} strokeWidth={2} />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Email Address</div>
              <div className="text-sm font-semibold text-slate-900">{member.email}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            <BadgeCheck size={14} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-tight">Verified</span>
          </div>
        </div>

        {/* Member ID Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:border-purple-200">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <IdCard size={20} strokeWidth={2} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Unique Member ID</div>
            <div className="text-sm font-bold text-slate-900 tabular-nums">
              #{String(member.id).padStart(4, '0')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}