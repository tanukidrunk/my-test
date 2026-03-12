import { Mars, Venus, CircleDot, LucideIcon } from 'lucide-react';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
 
export type MemberProfile = {
  id: number;
  username: string;
  email: string;
  gender: Gender;
  phone?: string;
  address?: string;
  avatarUrl?: string | null;
};

export type ProfileForm = {
  username: string;
  password: string;
  gender: Gender;
  phone?: string;
  address?: string;
};

export type UpdateProfilePayload = {
  username?: string;
  gender?: Gender;
  password?: string; 
  phone?: string;
  address?: string;
};

export type Toast = {
  id: number;
  type: 'success' | 'error';
  message: string;
};
 
// เปลี่ยนจาก emoji: string เป็น icon: LucideIcon
export const GENDER_OPTIONS: { value: Gender; label: string; icon: LucideIcon }[] = [
  { value: 'MALE',   label: 'Male',   icon: Mars },
  { value: 'FEMALE', label: 'Female', icon: Venus },
  { value: 'OTHER',  label: 'Other',  icon: CircleDot },
];

export function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}