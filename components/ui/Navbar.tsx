import Link from "next/link";

const Navbar = () => {
    return (
        <div className="fixed top-4 left-0 right-0 mx-auto max-w-5xl py-2 flex items-center px-6 bg-white/20 rounded-2xl z-50">
            <Link href="/" className="text-3xl text-white">
                Tools
            </Link>
            <div></div>
        </div>
    );
};

export default Navbar;
