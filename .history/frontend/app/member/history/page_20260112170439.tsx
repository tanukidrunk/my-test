"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProtectedLayout from "../../protected";
type Borrowed = {
  id: number;
  memberId: number;
  bookId: number;
  loanDate: string;
  returnDate?: string | null;
  status: "BORROWED" | "RETURNED";
  book: {
    title: string;
    author: string;
    publication_year: string;
  };
}; 

export default function HistoryBorrowedPage() {
  const [borrows, setBorrows] = useState<Borrowed[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBorrowByMember = async () => {
    try {
const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/borrow/member`,
        {
          headers: {
          Authorization: `Bearer ${token}`,
        },
        }
      );

      const json = await res.json();
      setBorrows(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("Failed to load borrowed book:", err);
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBorrowByMember();
  }, []);


  return (
    <ProtectedLayout>
    <div className="p-6 max-w-4xl mx-auto grid gap-6">
      <h1 className="text-3xl font-bold">Histories Borrowed book</h1>
      <div className="flex justify-end">
       <Link href="/member/book">
    <Button className="bg-blue-600 text-white">
      Book
    </Button>
  </Link>
      </div>
      

      {loading ? (
        <p>Loading borrowed book...</p>
      ) : (
        <Card>
          <CardContent className="p-4">
            {borrows.length === 0 ? (
              <p className="text-gray-500">You have no borrowed book.</p>
            ) : (
              <table className="w-full border-collapse border">
  <thead>
    <tr className="border-b">

      <th className="border px-2 py-1">Title</th>
      <th className="border px-2 py-1">Author</th>
      <th className="border px-2 py-1">Loan</th>
      <th className="border px-2 py-1">Return</th>
      <th className="border px-2 py-1">Status</th>

    </tr>
  </thead>
  <tbody>
    {borrows.filter((b) => b.status === "RETURNED")
    .map((b) => (
      <tr key={b.id} className="border-b">

        <td className="border px-2 py-1">{b.book.title}</td>
        <td className="border px-2 py-1">{b.book.author}</td>
        <td className="border px-2 py-1">
          {new Date(b.loanDate).toLocaleDateString()}
        </td>
        <td className="border px-2 py-1">
          {b.returnDate ? new Date(b.returnDate).toLocaleDateString() : "-"}
        </td>
        <td
          className={`border px-2 py-1 font-semibold ${
            b.status === "BORROWED"
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {b.status}
        </td>

   
      </tr>
    ))}
  </tbody>
</table>

            )}
          </CardContent>
        </Card>
      )}
    </div></ProtectedLayout>
  );
}
