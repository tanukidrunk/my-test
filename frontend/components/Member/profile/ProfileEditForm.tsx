'use client';
import { User, Phone, MapPin, Lock, Save, Loader2 } from 'lucide-react';
import { ProfileForm, GENDER_OPTIONS } from './profileTypes';
 
type Props = {
  form: ProfileForm;
  saving: boolean;
  onChange: (form: ProfileForm) => void;
  onSave: () => void;
};

export default function ProfileEditForm({ form, saving, onChange, onSave }: Props) {
  return (
    <div className="px-6 pb-6">
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-5">
        Edit Personal Information
      </div>

      <div className="space-y-5">
        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Username</label>
          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
            <input
              type="text"
              value={form.username}
              placeholder="Enter username"
              onChange={(e) => onChange({ ...form, username: e.target.value })}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Phone Number</label>
          <div className="relative group">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
            <input
              type="tel"
              value={form.phone || ''}
              placeholder="08X-XXX-XXXX"
              onChange={(e) => onChange({ ...form, phone: e.target.value })}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Address</label>
          <div className="relative group items-start flex">
            <MapPin className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
            <textarea
              value={form.address || ''}
              placeholder="Shipping address..."
              rows={3}
              onChange={(e) => onChange({ ...form, address: e.target.value })}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all duration-200 resize-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1 uppercase">New Password</label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
            <input
              type="password"
              value={form.password}
              placeholder="••••••••"
              onChange={(e) => onChange({ ...form, password: e.target.value })}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all duration-200"
            />
          </div>
          <p className="ml-1 text-[10px] text-slate-400 font-medium tracking-wide">Leave blank to keep the current password</p>
        </div>

        {/* Gender Selection - ปรับปรุงใหม่ให้เรียกใช้ opt.icon */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Gender Identity</label>
          <div className="flex gap-2">
            {GENDER_OPTIONS.map((opt) => {
              const isActive = form.gender === opt.value;
              const GenderIcon = opt.icon; // ดึง Component ไอคอนมาเก็บในตัวแปรตัวใหญ่

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ ...form, gender: opt.value })}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold
                    transition-all duration-200 active:scale-95
                    ${isActive
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                    }
                  `}
                >
                  <GenderIcon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={onSave}
          disabled={saving}
          className="
            w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white 
            bg-slate-900 hover:bg-slate-800 transition-all duration-200 
            active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed 
            shadow-xl shadow-slate-200 mt-4
          "
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Updating Profile...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}