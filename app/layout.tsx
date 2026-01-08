import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./providers";

export const metadata: Metadata = {
  title: "Find Guarana",
  description: "Full-stack application with maps and authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
