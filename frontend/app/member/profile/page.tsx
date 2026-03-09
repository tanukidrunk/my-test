'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedLayout from '../../Protected';
import ProfileAvatar from '@/components/Member/profile/ProfileAvatar';
import ProfileAccountInfo from '@/components/Member/profile/ProfileAccountInfo';
import ProfileEditForm from '@/components/Member/profile/ProfileEditForm';
import ProfileConfirmModal from '@/components/Member/profile/ProfileConfirmModal';
import ToastList from '@/components/Member/profile/ToastList';
import { useToast } from '@/components/Member/profile/useToast';
import {
  MemberProfile,
  ProfileForm,
  UpdateProfilePayload,
} from '@/components/Member/profile/profileTypes';
import { API_URL } from '@/app/lib/api/token';

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>({
    username: '',
    password: '',
    gender: 'OTHER',
    phone: '',
    address: '',
  });

  const [member, setMember] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const { toasts, addToast } = useToast();

  /* ───────── Load Profile ───────── */

useEffect(() => {
  const token = localStorage.getItem('token');

   if (!token) {
     console.error("No token found");
     return;
   }
  const load = async () => {
    try {
      const res = await fetch(`${API_URL}/member/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const json = await res.json(); // ✅ แปลง Response → JSON

      if (json.data) {
        setMember(json.data);
        setForm({
          username: json.data.username ?? '',
          password: '',
          gender: json.data.gender ?? 'OTHER',
          phone: json.data.phone ?? '',
          address: json.data.address ?? '',
        });

        if (json.data.avatarUrl) {
          setAvatarPreview(
            `${process.env.NEXT_PUBLIC_API}${json.data.avatarUrl}`
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // ✅ สำคัญ
    }
  };

  load();
}, []);

  /* ───────── Avatar Upload ───────── */

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };

    reader.readAsDataURL(file);

    setAvatarUploading(true);

    try {
   

      const fd = new FormData();
      fd.append('avatar', file);

      const res = await fetch(
        `${API_URL}/member/avatar`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: fd,
        }
      );

      addToast(
        res.ok ? 'success' : 'error',
        res.ok ? 'Profile picture updated!' : 'Failed to upload avatar'
      );
    } catch {
      addToast('error', 'Failed to upload avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  /* ───────── Save Click ───────── */

  const handleSaveClick = () => {
    if (!form.username.trim()) {
      addToast('error', 'Username cannot be empty');
      return;
    }

    setConfirmOpen(true);
  };

  /* ───────── Confirm Save ───────── */

  const handleConfirm = async () => {
  setSaving(true);

  try {
    const payload: UpdateProfilePayload = {
      username: form.username,
      gender: form.gender,
      phone: form.phone,
      address: form.address,
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    const res = await fetch(`${API_URL}/member/profile`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json(); // ✅ แปลงเป็น JSON

    addToast('success', json.message || 'Profile updated successfully');

    setMember((prev) =>
      prev
        ? {
            ...prev,
            username: form.username,
            gender: form.gender,
            phone: form.phone,
            address: form.address,
          }
        : prev
    );

    setForm((prev) => ({
      ...prev,
      password: '',
    }));
  } catch {
    addToast('error', 'Failed to update profile');
  } finally {
    setSaving(false);
    setConfirmOpen(false);
  }
};

  /* ───────── Loading State ───────── */

if (loading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3">
      <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm text-slate-400">Loading profile…</p>
    </div>
  );
}

  /* ───────── Page UI ───────── */

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-slate-50 font-sans">
        <div className="max-w-lg mx-auto px-4 py-8">

          {/* Breadcrumb */}

          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/member/dashboard"
              className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              Dashboard
            </Link>

            <span className="text-slate-300">/</span>

            <span className="text-slate-500">My Profile</span>
          </nav>

          {/* Card */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <ProfileAvatar
              member={member}
              avatarPreview={avatarPreview}
              uploading={avatarUploading}
              onChange={handleAvatarChange}
            />

            <div className="border-t border-slate-100 pt-5">

              {member && <ProfileAccountInfo member={member} />}

              <div className="border-t border-slate-100 pt-5">

                <ProfileEditForm
                  form={form}
                  saving={saving}
                  onChange={setForm}
                  onSave={handleSaveClick}
                />

              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileConfirmModal
        open={confirmOpen}
        form={form}
        saving={saving}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />

      <ToastList toasts={toasts} />
    </ProtectedLayout>
  );
}