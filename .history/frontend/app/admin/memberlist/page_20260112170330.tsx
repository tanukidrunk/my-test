"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { UserRound } from "lucide-react";
import ProtectedLayout from "../../protected";

type Gender = "MALE" | "FEMALE" | "OTHER";

type Member = {
  id: number;
  email: string;
  username: string;
  gender: Gender;
};
 
export default function MemberPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/member`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      setMembers(Array.isArray(json.data) ? json.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const genderTag = (g: Gender) => {
    switch (g) {
      case "MALE": return <Badge className="bg-blue-600">Male</Badge>;
      case "FEMALE": return <Badge className="bg-pink-500">Female</Badge>;
      default: return <Badge className="bg-gray-500">Other</Badge>;
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
        <UserRound size={40} className="text-blue-600" />
        Member Management
      </h1>

      <Card className="shadow-lg border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Members List</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Gender</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m, idx) => (
                <TableRow
                  key={m.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell>{m.id}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.username}</TableCell>
                  <TableCell>{genderTag(m.gender)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
