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
    <html lang="en" className='font-lenia'>
      <body className="relative text-white bg-black overflow-y-auto flex items-center justify-center">
        <Noise />
        <div className="absolute w-full h-full inset-0 z-10 bg-[url('/svg/small.svg')] bg-no-repeat bg-center bg-contain pointer-events-none select-none" />
        {children}
      </body>
    </html>
  );
}
