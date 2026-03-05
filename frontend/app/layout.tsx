import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Library System",
  description: "Library Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}