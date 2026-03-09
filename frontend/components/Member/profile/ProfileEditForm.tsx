'use client';
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
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Edit Profile
      </div>

      <div className="space-y-4">

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Username</label>
          <input
            type="text"
            value={form.username}
            placeholder="Enter username"
            onChange={(e) => onChange({ ...form, username: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Phone</label>
          <input
            type="tel"
            value={form.phone || ''}
            placeholder="Enter phone number"
            onChange={(e) => onChange({ ...form, phone: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Address</label>
          <textarea
            value={form.address || ''}
            placeholder="Enter address"
            rows={3}
            onChange={(e) => onChange({ ...form, address: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">New Password</label>
          <input
            type="password"
            value={form.password}
            placeholder="Leave blank to keep current password"
            onChange={(e) => onChange({ ...form, password: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200"
          />
          <p className="mt-1.5 text-xs text-slate-400">Minimum 8 characters recommended</p>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Gender</label>
          <div className="flex gap-2">
            {GENDER_OPTIONS.map((opt) => {
              const isActive = form.gender === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ ...form, gender: opt.value })}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium
                    transition-all duration-200 active:scale-95
                    ${
                      isActive
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }
                  `}
                >
                  <span>{opt.emoji}</span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={saving}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-blue-200 hover:shadow-md mt-2"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Saving…
            </span>
          ) : (
            '💾 Save Changes'
          )}
        </button>

      </div>
    </div>
  );
}