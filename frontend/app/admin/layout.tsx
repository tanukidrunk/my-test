// app/admin/layout.tsx
// import AdminProtectedLayout from '@/components/Admin/AdminProtected'; // พักไว้ก่อน
import AdminLayoutSidebar from '@/components/Admin/dashboard/AdminLayoutSidebar';

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <AdminProtectedLayout>
    <AdminLayoutSidebar>{children}</AdminLayoutSidebar>
    // </AdminProtectedLayout>
  );
}
