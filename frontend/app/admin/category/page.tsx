"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Layers } from "lucide-react";
 
type Category = {
  id: number;
  name: string;
}; 
 
export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<Category>({
    id: 0,
    name: "",
  });

  const loadCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/cate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      setCategories(Array.isArray(json.data) ? json.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategory();
  }, []);

  const openAddModal = () => {
    setForm({ id: 0, name: "" });
    setIsEditing(false);
    setOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setForm(cat);
    setIsEditing(true);
    setOpen(true);
  };

  const submitCategory = async () => {
    const token = localStorage.getItem("token");
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${process.env.NEXT_PUBLIC_API}/cate/${form.id}`
      : `${process.env.NEXT_PUBLIC_API}/cate/Addcategory`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" ,
        Authorization: `Bearer ${token}`},
      body: JSON.stringify({ name: form.name }),
    });

    setOpen(false);
    loadCategory();
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API}/category/${id}`, {
      method: "DELETE",
    });
    loadCategory();
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold flex gap-2 items-center">
        <Layers className="text-purple-600" />
        Category Management
      </h1>

      {/* ACTION BUTTON */}
      <Button onClick={openAddModal} className="bg-purple-600 hover:bg-purple-700">
        Add Category
      </Button>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Category List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-50">
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell className="flex gap-2 py-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(c)}>
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteCategory(c.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL FORM */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Category Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <DialogFooter className="mt-3">
            <Button onClick={submitCategory}>
              {isEditing ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
