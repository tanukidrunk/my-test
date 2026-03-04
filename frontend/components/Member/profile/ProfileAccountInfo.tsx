'use client';
import { MemberProfile } from './profileTypes';

type Props = { member: MemberProfile };

export default function ProfileAccountInfo({ member }: Props) {
  return (
    <div className="px-6 mb-6">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Account Info
      </div>
      <div className="space-y-3">
        {/* Email */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-base flex-shrink-0">
              📧
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Email</div>
              <div className="text-sm font-semibold text-slate-700">{member.email}</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            Verified
          </span>
        </div>

        {/* Member ID */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-base flex-shrink-0">
            🪪
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Member ID</div>
            <div className="text-sm font-semibold text-slate-700">
              #{String(member.id).padStart(4, '0')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}