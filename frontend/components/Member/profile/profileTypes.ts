export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type MemberProfile = {
  id: number;
  username: string;
  email: string;
  gender: Gender;
  avatarUrl?: string | null;
};

export type ProfileForm = {
  username: string;
  password: string;
  gender: Gender;
};

export type UpdateProfilePayload = {
  username?: string;
  gender?: Gender;
  password?: string;
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