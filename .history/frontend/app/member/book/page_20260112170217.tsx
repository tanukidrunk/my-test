"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProtectedLayout from "../../protected";
type Category = {
  id: number;
  name: string;
};

type Borrow = {
  id: number;
  memberId: number;
  bookId: number;
  loanDate: string;
  status: "BORROWED" | "RETURNED";
};
 
type Book = {
  id: number;
  title: string;
  author: string;
  publication_year: string;
  status: "AVAILABLE" | "BORROWED";
  category: Category;
  borrows: Borrow[];
};
 
export default function BooksListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    try {
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/book`, {
        
      });
      const json = await res.json();
      setBooks(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("Failed to load books:", err);
    } finally {
      setLoading(false);
    }
  };
 
 const handleBorrow = async (bookId: number) => {

 const res = await fetch(`${process.env.NEXT_PUBLIC_API}/borrow/borrowed`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    
  },
  body: JSON.stringify({ 
    bookId, 
  }),
});

  const json = await res.json();
setBooks(Array.isArray(json.data) ? json.data : []);
};
useEffect(() => {
  loadBooks();
}, []);


  if (loading) return <p className="p-6">Loading...</p>;

  return (
    
    <div className="p-6 max-w-6xl mx-auto">

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex justify-between">
            Books List
          </CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full border-collapse text-sm"> 
            <thead>
              <tr className="border-b bg-gray-100 text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Author</th>
                <th className="p-3">Year</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>  

            <tbody>
              {Array.isArray(books) &&
              books.map((book) => {
               
                const borrowed = book.status === "BORROWED";

                return (
                  <tr key={book.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{book.title}</td>
                    <td className="p-3">{book.author}</td>
                    <td className="p-3">{book.publication_year}</td>
                    <td className="p-3">{book.category?.name || "-"}</td>

                    <td className="p-3">
                      {borrowed ? (
                        <span className="text-yellow-500 font-bold">Borrowed</span>
                      ) : (
                        <span className="text-green-600 font-bold">Available</span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {!borrowed && (
                        <Button
                            onClick={() => handleBorrow(book.id)}
                            variant="default">
                            Borrow
                          </Button>
                        )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
