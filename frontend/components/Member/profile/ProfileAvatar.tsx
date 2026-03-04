'use client';
import { useRef } from 'react';
import { MemberProfile, getInitials } from './profileTypes';

type Props = {
  member: MemberProfile | null;
  avatarPreview: string | null;
  uploading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ProfileAvatar({ member, avatarPreview, uploading, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center pt-6 pb-4 px-6 relative">
      {/* Banner */}
      <div className="absolute top-0 left-0 right-0 h-24 rounded-t-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      {/* Avatar */}
      <div
        className="relative mt-10 cursor-pointer group z-10"
        onClick={() => fileRef.current?.click()}
      >
        <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
          {avatarPreview ? (
            <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
              {member ? getInitials(member.username) : '?'}
            </div>
          )}
        </div>

        {/* Overlay */}
        <div className={`
          absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-0.5
          bg-black/50 text-white
          transition-opacity duration-200
          ${uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}>
          {uploading ? (
            <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span className="text-base">📷</span>
              <span className="text-[10px] font-semibold">Change</span>
            </>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </div>

      {/* Name */}
      <div className="mt-3 text-center">
        <p className="text-lg font-bold text-slate-800">{member?.username}</p>
        <p className="text-sm text-slate-400">{member?.email}</p>
      </div>
    </div>
  );
}