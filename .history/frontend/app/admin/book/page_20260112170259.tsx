"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ProtectedLayout from "../../protected";

type Book = {
  id: number;
  title: string;
  author: string;
  publication_year: string;
  categoryId: number;
};

type Category = {
  id: number;
  name: string;
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Book>({
    id: 0,
    title: "",
    author: "",
    publication_year: "",
    categoryId: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  const loadBooks = async () => {
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/book`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();

      setBooks(Array.isArray(json.data) ? json.data : []);
      
    } catch (err) {
      console.error("Error loading books:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/cate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      setCategories(json.data);
    } catch (err) {
      console.error("Error loading category:", err);
    }
  };

  useEffect(() => {
    
    loadBooks();
    loadCategories();
  }, []);

  const resetForm = () => {
    setForm({
      id: 0,
      title: "",
      author: "",
      publication_year: "",
      categoryId: 0,
    });
    setIsEditing(false);
  };

  const submitBook = async () => {
  try {
    const token = localStorage.getItem("token");

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${process.env.NEXT_PUBLIC_API}/book/${form.id}`
      : `${process.env.NEXT_PUBLIC_API}/book`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const text = await res.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      console.error("Non-JSON response:", text);
      alert("Server error");
      return;
    }

    if (!res.ok) {
      alert(json.message || "Failed");
      return;
    }

    resetForm();
    loadBooks();
  } catch (err) {
    console.error("Failed to submit:", err);
  }
};


 const deleteBook = async (id: number) => {
  if (!confirm("Delete this book?")) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/book/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const text = await res.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      console.error("Non-JSON response:", text);
      alert("Server error");
      return;
    }

    if (!res.ok) {
      alert(json.message || "Delete failed");
      return;
    }

    loadBooks();
  } catch (err) {
    console.error("Failed to delete:", err);
  }
};


  const editBook = (b: Book) => {
    setForm(b);
    setIsEditing(true);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 grid gap-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Books Management</h1>

      <Card className="shadow">
        <CardContent className="p-4 grid gap-3">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Book" : "Add Book"}
          </h2>

          <input
            className="border rounded p-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="border rounded p-2"
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />

          <input
            className="border rounded p-2"
            placeholder="Year"
            value={form.publication_year}
            onChange={(e) =>
              setForm({ ...form, publication_year: e.target.value })
            }
          />

          <select
            className="border rounded p-2"
            value={form.categoryId}
            onChange={(e) =>
              setForm({ ...form, categoryId: Number(e.target.value) })
            }
          >
            <option value={0}>Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <Button onClick={submitBook}>
              {isEditing ? "Save" : "Add"}
            </Button>

            {isEditing && (
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-3">Book List</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Year</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id} className="border-b">
                  <td>{b.id}</td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.publication_year}</td>
                  <td>
                    {categories.find((c) => c.id === b.categoryId)?.name ??
                      "Unknown"}
                  </td>
                  <td className="flex gap-2 py-2">
                    <Button size="sm" onClick={() => editBook(b)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteBook(b.id)}
                    >
                      Delete
                    </Button>
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
