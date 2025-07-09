import type { Metadata } from "next";
import "./globals.css";
import Noise from "@/components/svg/Noise";
import Navbar from "@/components/ui/Navbar";

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
            <body className="text-white bg-black min-h-screen">
                <Noise />
                <div className="fixed w-full h-full inset-0 z-0 bg-[url('/svg/small.svg')] bg-no-repeat bg-center bg-contain pointer-events-none select-none" />
                <Navbar />
                <main className="relative pt-20 flex flex-col items-center justify-center min-h-screen">
                    {children}
                </main>
            </body>
        </html>
    );
}
