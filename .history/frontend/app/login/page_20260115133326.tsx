"use client";
  
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
   
    try {
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/member/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const text = await res.text();
      console.log("Response:", text);

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        setError("Server error: response not JSON");
        setLoading(false);
        return;
      } 

      if (!res.ok || !json.data) {
        setError(json.message || "Login failed");
        setLoading(false);
        return;
      }
      
      localStorage.setItem("token", json.data.token);
      const meRes = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
        headers: {
                Authorization: `Bearer ${json.data.token}`,
              },
});
      const meJson = await meRes.json();
const member = meJson.data?.member;

      if (member?.role === "ADMIN") {
      router.replace("/admin/dashboard");
      } else {
      router.replace("/member/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }


  };
  //   const handleGoogleLogin = () => {
  //   window.location.href = `${process.env.NEXT_PUBLIC_API}/auth/google`;
  // };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>

             
             {/* <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              Login with Google
            </Button> */}

          </form>
          

          <p className="text-sm text-center mt-4 text-gray-500">
            Dont have an account?{" "}
            <Link href="/register" className="text-blue-600">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
