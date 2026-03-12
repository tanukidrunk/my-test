'use client';
import { AlertTriangle, Loader2, Check } from 'lucide-react'; // นำเข้าไอคอนจาก Lucide
import { ProfileForm, GENDER_OPTIONS } from './profileTypes';
 
type Props = {
  open: boolean;
  form: ProfileForm;
  saving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ProfileConfirmModal({
  open,
  form,
  saving,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  const genderLabel =
    GENDER_OPTIONS.find((g) => g.value === form.gender)?.label ?? form.gender;

  const hasPassword = form.password.trim() !== '';

  const rows = [
    { label: 'Username', value: form.username },
    { label: 'Gender', value: genderLabel },
    ...(hasPassword
      ? [{ label: 'Password', value: '•••••••• (Update)' }]
      : []),
  ];

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        bg-slate-950/40 backdrop-blur-[2px]
        transition-opacity duration-300
        ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      onClick={onCancel}
    >
      <div
        className={`
          bg-white rounded-[2rem] shadow-2xl w-full max-w-[340px] p-8
          transition-all duration-300 ease-out border border-slate-100
          ${open
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Icon - ปรับเป็น Warning Icon แบบนุ่มนวล */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center ring-8 ring-amber-50/50">
            <AlertTriangle size={32} strokeWidth={2} />
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
            Confirm Changes
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Review your new settings
          </p>
        </div>

        {/* Data Preview Card */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/60 divide-y divide-slate-200/60 mb-8 overflow-hidden">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-slate-100/50"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {r.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-800">
                  {r.value}
                </span>
                <Check size={14} className="text-emerald-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            disabled={saving}
            className="
              w-full py-3 rounded-2xl text-sm font-bold text-white
              bg-slate-900 hover:bg-slate-800
              transition-all duration-200 active:scale-[0.98]
              disabled:opacity-70 shadow-lg shadow-slate-200
              flex items-center justify-center gap-2
            "
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              'Save Changes'
            )}
          </button>
          
          <button
            onClick={onCancel}
            disabled={saving}
            className="
              w-full py-3 rounded-2xl text-sm font-bold text-slate-500
              hover:text-slate-800 hover:bg-slate-100
              transition-all duration-200 active:scale-[0.98]
              disabled:opacity-50
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}