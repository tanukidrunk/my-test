export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type MemberProfile = {
  id: number;
  username: string;
  email: string;
  gender: Gender;
  phone?: string
  address?: string
  avatarUrl?: string | null;
};

export type ProfileForm = {
  username: string;
  password: string;
  gender: Gender;
  phone?: string
  address?: string
};

export type UpdateProfilePayload = {
  username?: string;
  gender?: Gender;
  password?: string;
  phone?: string
  address?: string
};

export type Toast = {
  id: number;
  type: 'success' | 'error';
  message: string;
};

export const GENDER_OPTIONS: { value: Gender; label: string; emoji: string }[] = [
  { value: 'MALE',   label: 'Male',   emoji: '👨' },
  { value: 'FEMALE', label: 'Female', emoji: '👩' },
  { value: 'OTHER',  label: 'Other',  emoji: '🧑' },
];

export function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}