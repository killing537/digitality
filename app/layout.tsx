import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css"; // WAJIB: Agar komponen upload tidak "Loading" terus

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DigiPay - Toko Digital",
  description: "Beli produk digital dengan QRIS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={geist.className}>{children}</body>
    </html>
  );
}
