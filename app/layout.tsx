import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mirror - Whatfix",
  description: "Content organization prototype for Whatfix Mirror",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
