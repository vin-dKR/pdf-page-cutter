import Image from "next/image";
import Link from "next/link"

export default function Home() {
    return (
        <div className="relative z-0 pt-40 text-white min-h-screen overflow-hidden items-center">
            {/* cards */}
            <div className="flex flex-col md:flex-row gap-8">

            <Link href="/chapter-splitter">
                    <div className="w-60 h-auto bg-white/10 rounded-lg border border-white/7 border-[2px] p-4 text-xl shadow-md backdrop-blur-3xl overflow-hidden">
                        <h1 className="mb-2">
                            Chapter Splitter
                        </h1>
                        <div className="w-full h-full rounded-md bg-white/10 shadow-md overflow-hidden">
                            <Image
                                src="/images/chap-split.png"
                                alt="padf page cutter"
                                width={800}
                                height={450}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </Link>

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


                <Link href="/qna-pdf">
                    <div className="w-60 h-auto bg-white/10 rounded-lg border border-white/7 border-[2px] p-4 text-xl shadow-md backdrop-blur-3xl overflow-hidden">
                        <h1 className="mb-2">
                            QnA PDF Generator
                        </h1>
                        <div className="w-full h-full rounded-md bg-white/10 shadow-md overflow-hidden">
                            <Image
                                src="/images/qna.png"
                                alt="padf page cutter"
                                width={800}
                                height={450}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </Link>

                <Link href="/rename-jpg">
                    <div className="w-60 h-auto bg-white/10 rounded-lg border border-white/7 border-[2px] p-4 text-xl shadow-md backdrop-blur-3xl">
                        <h1 className="mb-2">
                            Image Renamer
                        </h1>
                        <div className="w-full h-full rounded-md bg-white/10 shadow-md overflow-hidden">
                            <Image
                                src="/images/img-rename.png"
                                alt="padf page cutter"
                                width={800}
                                height={450}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </Link>
                
                <Link href="/pdf-editor">
                    <div className="w-60 h-auto bg-white/10 rounded-lg border border-white/7 border-[2px] p-4 text-xl shadow-md backdrop-blur-3xl">
                        <h1 className="mb-2">
                            Pdf Editor
                        </h1>
                        <div className="w-full h-full rounded-md bg-white/10 shadow-md overflow-hidden">
                            <Image
                                src="/images/img-rename.png"
                                alt="padf page cutter"
                                width={800}
                                height={450}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
