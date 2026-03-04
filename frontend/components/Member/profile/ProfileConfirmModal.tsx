'use client';
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
      ? [{ label: 'Password', value: '•••••••• (will be changed)' }]
      : []),
  ];

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/40 backdrop-blur-sm
        transition-opacity duration-200
        ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      onClick={onCancel}
    >
      <div
        className={`
          bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7
          transition-all duration-300
          ${open
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
            ⚠️
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-800 text-center mb-1">
          Confirm Changes
        </h2>
        <p className="text-sm text-slate-400 text-center mb-5">
          Please review before saving
        </p>

        <div className="bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-100 mb-6 overflow-hidden">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {r.label}
              </span>
              <span className="text-sm font-medium text-slate-700">
                {r.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={saving}
            className="
              flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600
              hover:bg-slate-50 transition-all duration-150 active:scale-95
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={saving}
            className="
              flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
              bg-blue-600 hover:bg-blue-700
              transition-all duration-150 active:scale-95
              disabled:opacity-60 shadow-sm hover:shadow-blue-200 hover:shadow-md
            "
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </span>
            ) : (
              'Confirm Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}