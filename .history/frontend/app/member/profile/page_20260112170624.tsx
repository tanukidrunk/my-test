'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import ProtectedLayout from "../../protected";

type Gender = 'MALE' | 'FEMALE' | 'OTHER';
type UpdateProfilePayload = {
  username?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
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
};

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>({
    username: '',
    password: '',
    gender: 'OTHER',
  });
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
const token = localStorage.getItem("token")

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/member/profile`,
          {
            headers: {
          Authorization: `Bearer ${token}`,
        },
          }
        );

        const json = await res.json();

        if (json.data) {
          setMember(json.data);
          setForm({
            username: json.data.username ?? '',
            password: '',
            gender: json.data.gender ?? 'OTHER',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async () => {
const token = localStorage.getItem("token");

    const payload: UpdateProfilePayload = {
      username: form.username,
      gender: form.gender as 'MALE' | 'FEMALE' | 'OTHER',
    };
    if (form.password.trim() !== '') {
      payload.password = form.password;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/member/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const json: { message: string } = await res.json();
    alert(json.message);
    setForm((prev) => ({ ...prev, password: '' }));
  };

  if (loading) return <p>Loading...</p>;

  return (
<ProtectedLayout>

    <Card className='max-w-md mx-auto mt-10'> 
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <Label>Username : {form.username}</Label>
          <Input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>
        <div>
          <Label>New Password</Label>
          <Input
            type='password'
            placeholder='Leave blank to keep current password'
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div>
          <Label>Gender</Label>
          <select
            className='w-full border rounded px-2 py-1'
            value={form.gender}
            onChange={(e) =>
              setForm({ ...form, gender: e.target.value as Gender })
            }
          >
            <option value='MALE'>Male</option>
            <option value='FEMALE'>Female</option>
            <option value='OTHER'>Other</option>
          </select>
        </div>

        <Button onClick={handleSubmit} className='w-full'>
          Save Changes
        </Button>
      </CardContent>
    </Card></ProtectedLayout>
  );
}
