import type { Metadata } from "next";
import "./globals.css";
import Noise from "@/components/svg/Noise";


export const metadata: Metadata = {
  title: "Tools Internal",
  description: "PDF and JPGs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='font-poppins'>
      <body className="text-white bg-black">
        <Noise />
        <div className="fixed w-full h-full inset-0 z-10 bg-[url('/svg/small.svg')] bg-no-repeat bg-center bg-contain pointer-events-none select-none" />
        <main className="relative z-20 overflow-y-auto h-screen flex items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
