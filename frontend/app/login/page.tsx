'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { setToken , API_URL} from '@/app/lib/api/token';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    setLoading(true);
    setError('');
 
    try {
      const res = await fetch(`${API_URL}/member/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message || 'Login failed');
        setLoading(false);
        return;
      }

      // ✅ เก็บ token
      const token = json?.data?.token;

      if (!token) {
      setError("Token not returned from API");
      setLoading(false);
      return;
      }

      setToken(token);
      console.log('token saved:', localStorage.getItem('token'));

      // ✅ ใช้ apiFetch (มี Authorization อัตโนมัติ)
      const meRes = await fetch(`${API_URL}/member/profile`,{
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!meRes.ok) {
         throw new Error("Failed to fetch profile");
      }

      const meJson = await meRes.json();
      const member = meJson.data;

      if (member?.role === 'ADMIN') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/member/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    }

    setLoading(false);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader>
          <CardTitle className='text-2xl text-center'>Log In</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label>Email</Label>
              <Input
                type='text'
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type='password'
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && <p className='text-red-600'>{error}</p>}

            <Button className='w-full' disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <p className='text-sm text-center mt-4'>
            Dont have an account?{' '}
            <Link href='/register' className='text-blue-600'>
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}