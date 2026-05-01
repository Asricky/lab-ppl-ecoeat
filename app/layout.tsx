import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css"; 

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoEat - Delivery & Surplus Food",
  description: "Marketplace and delivery system for surplus food.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50/50">
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
