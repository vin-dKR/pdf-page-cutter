import Image from "next/image";
import Link from "next/link"

export default function Home() {
  return (
    <div className="relative text-white min-h-screen overflow-hidden items-center">
      <div className=" mx-auto pt-16">
        <h1 className="text-3xl font-bold text-center mb-16">Question Tools</h1>
      </div>

      {/* cards */}
      <div className="flex flex-col md:flex-row gap-8">
        <Link href="/pdf-split">
          <div className="w-60 h-auto bg-white/10 rounded-lg border border-white/7 border-[2px] p-4 text-xl shadow-md backdrop-blur-3xl overflow-hidden">
            <h1 className="mb-2">
              PDF Page Cutter
            </h1>
            <div className="w-full h-full rounded-md bg-white/10 shadow-md overflow-hidden">
              <Image 
                src="/images/page-cutter.png"
                alt="padf page cutter"
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Link>
        <Link href="/rename-jpg">
          <div className="w-60 h-40 bg-white/10 rounded-lg border border-white/7 border-[2px] px-4 py-2 text-xl shadow-md backdrop-blur-3xlR">
          <h1 className="mb-1">
            Image Rename
          </h1>
            <div className="w-full h-25 rounded-md bg-white/10 shadow-md">
            </div>
          </div>

        </Link>
        <Link href="/qna-pdf">
          <div className="w-60 h-40 bg-white/10 rounded-lg border border-white/7 border-[2px] px-4 py-2 text-xl shadow-md backdrop-blur-3xl">
          <h1 className="mb-1">
            QnA PDF Generator
          </h1>
            <div className="w-full h-25 rounded-md bg-white/10 shadow-md">

            </div>
          </div>

        </Link>
        <Link href="/rename-chapter">
          <div className="w-60 h-40 bg-white/10 rounded-lg border border-white/7 border-[2px] px-4 py-2 text-xl shadow-md backdrop-blur-3xl">
          <h1 className="mb-1">
            Rename Chapter
          </h1>
            <div className="w-full h-25 rounded-md bg-white/10 shadow-md">

            </div>
          </div>

        </Link>
      </div>
    </div>
  );
}
