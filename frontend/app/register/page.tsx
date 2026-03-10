'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { API_URL} from '@/app/lib/api/token';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    gender: 'OTHER',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `${API_URL}/member/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Sign-up failed');
        setLoading(false);
        return;
      }

      setLoading(false);

      router.push('/login');
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Register
          </CardTitle>
        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            {/* Username */}

            <div>
              <Label>Username</Label>
              <Input
                type="text"
                placeholder="Enter username"
                value={form.username}
                onChange={(e) => handleChange('username', e.target.value)}
                required
              />
            </div>

            {/* Password */}

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Password (min 10 chars, A-Z a-z 0-9)"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </div>

            {/* Phone */}

            <div>
              <Label>Phone</Label>
              <Input
                type="tel"
                placeholder="0812345678"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            {/* Address */}

            <div>
              <Label>Address</Label>
              <Input
                type="text"
                placeholder="Enter address"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>

            {/* Gender */}

            <div>
              <Label>Gender</Label>

              <Select
                value={form.gender}
                onValueChange={(value) => handleChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>

              </Select>

            </div>

            {/* Error */}

            {error && (
              <p className="text-red-600 text-sm">
                {error}
              </p>
            )}

            {/* Button */}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>

          </form>

          <p className="text-sm text-center mt-4 text-gray-500">

            Already have an account?

            <Link
              href="/login"
              className="text-blue-600 ml-1"
            >
              Log in
            </Link>

          </p>

        </CardContent>
      </Card>

    </div>
  );
}
