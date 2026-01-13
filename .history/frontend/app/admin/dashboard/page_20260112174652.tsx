"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedLayout from "../../protected";

type Borrowed = {
  id: number;
  memberId: number;
  bookId: number;
  loanDate: string;
  returnDate?: string | null;
  status: "BORROWED" | "RETURNED";

};  

export default function AdminDashboard() {
  const [borrowed, setBorrowed] = useState<Borrowed[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

const loadBorrowed = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/borrow`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await res.json();

    setBorrowed(Array.isArray(json.data) ? json.data : []);
  } catch (err) {
    console.error("Error loading borrowed:", err);
    setBorrowed([]);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {

    const token = localStorage.getItem("token");
if (!token) {
    router.replace("/login");
    return;
  }
    if (!token !== "ADMIN") {
      router.replace("/login");
    }

  fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

    loadBorrowed();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  const total = borrowed.length;
  const active = borrowed.filter((b) => b.status === "BORROWED").length;
  const returned = borrowed.filter((b) => b.status === "RETURNED").length;
  
  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-3xl font-bold">Borrowed Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow">
          <CardContent className="p-4">
            <h2 className="font-semibold text-xl">Total Borrowed</h2>
            <p className="text-3xl mt-2">{total}</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardContent className="p-4">
            <h2 className="font-semibold text-xl">Active</h2>
            <p className="text-3xl mt-2">{active}</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardContent className="p-4">
            <h2 className="font-semibold text-xl">Returned</h2>
            <p className="text-3xl mt-2">{returned}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg mb-4">Borrowed Records</h2>
            
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">ID</th>
                <th>Member</th>
                <th>Book</th>
                <th>Loan Date</th>
                <th>Return Date</th>
                <th>Status</th>

              </tr>
            </thead>

            <tbody>
              {borrowed.map((b) => (
                <tr key={b.id} className="border-b h-12">
                  <td>{b.id}</td>
                  <td>{b.memberId}</td>
                  <td>{b.bookId}</td>
                  <td>{b.loanDate}</td>
                  <td>{b.returnDate ?? "-"}</td>
                  <td
                    className={
                      b.status === "BORROWED" ? "text-yellow-600" : "text-green-600"
                    }
                  >
                    {b.status}
                  </td>

                </tr> 
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
