'use client';
import { useRef } from 'react';
import { Camera, Loader2, User } from 'lucide-react'; // นำเข้าไอคอนจาก Lucide
import { MemberProfile, getInitials } from './profileTypes';
 
type Props = {
  member: MemberProfile | null;
  avatarPreview: string | null;
  uploading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ProfileAvatar({ member, avatarPreview, uploading, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  // คำนวณชื่อเต็มเพื่อใช้เป็น alt text หรือ fallback
  const fullName = member ? member.username : 'User Profile';

  return (
    <div className="flex flex-col items-center pt-8 pb-4 px-6 relative">
      {/* Banner - ปรับสีให้ดูซอฟต์ลงและเป็น shadcn style */}
      <div className="absolute top-0 left-0 right-0 h-28 rounded-t-2xl bg-slate-900 overflow-hidden shadow-inner">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      {/* Avatar Container */}
      <div
        className="relative mt-12 cursor-pointer group z-10"
        onClick={() => !uploading ? fileRef.current?.click() : undefined} // ป้องกันการคลิกซ้ำขณะอัปโหลด
      >
        <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl bg-white flex items-center justify-center">
          {avatarPreview ? (
            <img 
              src={avatarPreview} 
              alt={fullName} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
          ) : member ? (
            // Placeholder เมื่อมีชื่อแต่ไม่มีรูป (ใช้ getInitials)
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-600 text-3xl font-bold uppercase tracking-wider">
              {getInitials(member.username)}
            </div>
          ) : (
            // Placeholder เมื่อไม่มี Member (ใช้ไอคอน User)
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
              <User size={48} strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Overlay - ปรับดีไซน์ให้ดูเป็นมืออาชีพขึ้น */}
        <div className={`
          absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-1.5
          bg-slate-900/70 text-white backdrop-blur-[2px]
          transition-opacity duration-300 ease-in-out
          ${uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}>
          {uploading ? (
            // ใช้ Loader2 + spin animation
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-white" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Uploading...</span>
            </div>
          ) : (
            <>
              {/* ใช้ Camera icon แทน Emoji 📷 */}
              <Camera size={24} strokeWidth={2} />
              <span className="text-[11px] font-bold uppercase tracking-widest">Change</span>
            </>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
          disabled={uploading} // ป้องกันการเลือกไฟล์ขณะอัปโหลด
        />
      </div>

      {/* Name Area */}
      <div className="mt-4 text-center">
        <p className="text-xl font-extrabold text-slate-950 tabular-nums tracking-tight">
          {member?.username || 'Guest User'}
        </p>
        <p className="text-sm font-medium text-slate-500 mt-0.5">
          {member?.email || 'Sign in to access your profile'}
        </p>
      </div>
    </div>
  );
}