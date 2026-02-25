'use client';
import { useEffect, useRef, useState } from 'react';
import ProtectedLayout from '../../Protected';
import Link from 'next/link';
import styles from './profile.module.css';

type Gender = 'MALE' | 'FEMALE' | 'OTHER';

type UpdateProfilePayload = {
  username?: string;
  gender?: Gender;
  password?: string;
};

type ProfileForm = {
  username: string;
  password: string;
  gender: Gender;
};

type MemberProfile = {
  id: number;
  username: string;
  email: string;
  gender: Gender;
  avatarUrl?: string | null;
};

type Toast = {
  id: number;
  type: 'success' | 'error';
  message: string;
};

const GENDER_OPTIONS: { value: Gender; label: string; emoji: string }[] = [
  { value: 'MALE', label: 'Male', emoji: '👨' },
  { value: 'FEMALE', label: 'Female', emoji: '👩' },
  { value: 'OTHER', label: 'Other', emoji: '🧑' },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>({
    username: '',
    password: '',
    gender: 'OTHER',
  });
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ?? Toast helper ?? */
  const addToast = (type: Toast['type'], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  };

  /* ?? Load profile ?? */
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/member/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const json = await res.json();
        if (json.data) {
          setMember(json.data);
          setForm({
            username: json.data.username ?? '',
            password: '',
            gender: json.data.gender ?? 'OTHER',
          });
          if (json.data.avatarUrl)
            setAvatarPreview(
              `${process.env.NEXT_PUBLIC_API}${json.data.avatarUrl}`,
            );
        }
      } catch (err) {
        console.error(err);
        addToast('error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  /* ?? Avatar change ?? */
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload to server
    setAvatarUploading(true);
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/member/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        addToast('success', 'Profile picture updated!');
      } else {
        addToast('error', 'Failed to upload avatar');
      }
    } catch {
      addToast('error', 'Failed to upload avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  /* ?? Open confirm modal ?? */
  const handleSaveClick = () => {
    if (!form.username.trim()) {
      addToast('error', 'Username cannot be empty');
      return;
    }
    setConfirmOpen(true);
  };

  /* ?? Actual submit ?? */
  const handleConfirm = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const payload: UpdateProfilePayload = {
        username: form.username,
        gender: form.gender,
      };
      if (form.password.trim() !== '') payload.password = form.password;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/member/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const json: { message: string } = await res.json();

      if (res.ok) {
        addToast('success', json.message || 'Profile updated successfully');
        setMember((prev) =>
          prev
            ? { ...prev, username: form.username, gender: form.gender }
            : prev,
        );
        setForm((prev) => ({ ...prev, password: '' }));
      } else {
        addToast('error', json.message || 'Failed to update profile');
      }
    } catch {
      addToast('error', 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
      setConfirmOpen(false);
    }
  };

  /* ?? Loading ?? */
  if (loading) {
    return (
      <ProtectedLayout>
        <div className={styles.loadingWrap}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Loading profile...</p>
        </div>
      </ProtectedLayout>
    );
  }

  const genderLabel =
    GENDER_OPTIONS.find((g) => g.value === form.gender)?.label ?? form.gender;
  const hasPasswordChange = form.password.trim() !== '';

  return (
    <ProtectedLayout>
      <link
        href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap'
        rel='stylesheet'
      />

      <div className={styles.pageRoot}>
        <div className={styles.layout}>
          {/* ?? BREADCRUMB ?? */}
          <nav className={styles.breadcrumb}>
            <Link href='/member/dashboard' className={styles.breadcrumbLink}>
              Dashboard
            </Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>My Profile</span>
          </nav>

          {/* ?? CARD ?? */}
          <div className={styles.card}>
            {/* Banner */}
            <div className={styles.cardBanner}>
              <div className={styles.cardBannerDecor} />
            </div>

            {/* Avatar + Name */}
            <div className={styles.avatarSection}>
              {/* Clickable avatar with upload overlay */}
              <div
                className={styles.avatarUploadWrap}
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img
                    className={styles.avatarImg}
                    src={avatarPreview}
                    alt='avatar'
                  />
                ) : (
                  <div className={styles.avatar}>
                    {member ? getInitials(member.username) : '?'}
                  </div>
                )}

                {avatarUploading ? (
                  <div className={styles.avatarUploadProgress}>?</div>
                ) : (
                  <div className={styles.avatarOverlay}>
                    <span className={styles.avatarOverlayIcon}>📷</span>
                    <span className={styles.avatarOverlayText}>Change</span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  className={styles.avatarFileInput}
                  onChange={handleAvatarChange}
                />
              </div>

              <div className={styles.nameBlock}>
                <p className={styles.nameBlockTitle}>{member?.username}</p>
                <p className={styles.nameBlockSub}>{member?.email}</p>
              </div>
            </div>

            <div className={styles.cardBody}>
              {/* ?? ACCOUNT INFO ?? */}
              <div className={styles.sectionLabel}>Account Info</div>

              <div className={styles.infoRow}>
                <div className={styles.infoRowLeft}>
                  <div className={`${styles.infoIcon} ${styles.infoIconBlue}`}>
                    ??
                  </div>
                  <div>
                    <div className={styles.infoLabel}>Email</div>
                    <div className={styles.infoValue}>{member?.email}</div>
                  </div>
                </div>
                <span className={styles.infoBadge}>Verified</span>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoRowLeft}>
                  <div
                    className={`${styles.infoIcon} ${styles.infoIconPurple}`}
                  >
                    ??
                  </div>
                  <div>
                    <div className={styles.infoLabel}>Member ID</div>
                    <div className={styles.infoValue}>
                      #{String(member?.id).padStart(4, '0')}
                    </div>
                  </div>
                </div>
              </div>

              {/* ?? EDIT SECTION ?? */}
              <div className={styles.formSpacer}>
                <div className={styles.sectionLabel}>Edit Profile</div>

                {/* Username */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Username</label>
                  <input
                    className={styles.formInput}
                    type='text'
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    placeholder='Enter username'
                  />
                </div>

                {/* Password */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>New Password</label>
                  <input
                    className={styles.formInput}
                    type='password'
                    placeholder='Leave blank to keep current password'
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                  <p className={styles.formInputHint}>
                    Minimum 8 characters recommended
                  </p>
                </div>

                {/* Gender */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Gender</label>
                  <div className={styles.genderOptions}>
                    {GENDER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type='button'
                        className={`${styles.genderBtn} ${form.gender === opt.value ? styles.genderBtnActive : ''}`}
                        onClick={() => setForm({ ...form, gender: opt.value })}
                      >
                        <span className={styles.genderEmoji}>{opt.emoji}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save */}
                <button
                  className={styles.saveBtn}
                  onClick={handleSaveClick}
                  disabled={saving}
                >
                  {saving ? '? Saving...' : '? Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ?? CONFIRM MODAL ?? */}
      {confirmOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalIconWrap}>⚠️</div>
            <h2 className={styles.modalTitle}>Confirm Changes</h2>
            <p className={styles.modalBody}>
              Please review the changes before saving:
            </p>

            <div className={styles.modalChanges}>
              <div className={styles.modalChangeRow}>
                <span className={styles.modalChangeLabel}>Username</span>
                <span className={styles.modalChangeValue}>{form.username}</span>
              </div>
              <div className={styles.modalChangeRow}>
                <span className={styles.modalChangeLabel}>Gender</span>
                <span className={styles.modalChangeValue}>{genderLabel}</span>
              </div>
              {hasPasswordChange && (
                <div className={styles.modalChangeRow}>
                  <span className={styles.modalChangeLabel}>Password</span>
                  <span className={styles.modalChangeValue}>
                    •••••••• (will be changed)
                  </span>
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setConfirmOpen(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleConfirm}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Confirm Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ?? TOASTS ?? */}
      <div className={styles.toastWrap}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${t.type === 'success' ? styles.toastSuccess : styles.toastError}`}
          >
            <span className={styles.toastIcon}>
              {t.type === 'success' ? '✅' : '❌'}
            </span>
            <span className={styles.toastMsg}>{t.message}</span>
          </div>
        ))}
      </div>
    </ProtectedLayout>
  );
}
