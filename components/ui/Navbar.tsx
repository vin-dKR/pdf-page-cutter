"use client"
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="fixed top-4 left-0 right-0 mx-auto max-w-5xl py-2 flex items-center justify-between px-4 md:px-6 bg-white/20 backdrop-blur-md rounded-md z-50">
            <Link href="/" className="text-xl md:text-3xl text-white font-bold">
                Tools
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6">
                <Link href="/" className="text-white hover:text-blue-300 transition-colors text-sm lg:text-base">
                    Home
                </Link>
                <Link href="/chapter-splitter" className="text-white hover:text-blue-300 transition-colors text-sm lg:text-base">
                    Chapter Splitter
                </Link>
                <Link href="/pdf-split" className="text-white hover:text-blue-300 transition-colors text-sm lg:text-base">
                    PDF Split
                </Link>
                <Link href="/qna-pdf" className="text-white hover:text-blue-300 transition-colors text-sm lg:text-base">
                    QnA PDF
                </Link>
                <Link href="/rename-jpg" className="text-white hover:text-blue-300 transition-colors text-sm lg:text-base">
                    Rename JPG
                </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
                onClick={toggleMenu}
                className="md:hidden text-white p-2"
                aria-label="Toggle menu"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {isMenuOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    )}
                </svg>
            </button>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-md shadow-lg md:hidden">
                    <nav className="flex flex-col py-2">
                        <Link 
                            href="/" 
                            className="px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link 
                            href="/chapter-splitter" 
                            className="px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Chapter Splitter
                        </Link>
                        <Link 
                            href="/pdf-split" 
                            className="px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            PDF Split
                        </Link>
                        <Link 
                            href="/qna-pdf" 
                            className="px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            QnA PDF
                        </Link>
                        <Link 
                            href="/rename-jpg" 
                            className="px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Rename JPG
                        </Link>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default Navbar;
