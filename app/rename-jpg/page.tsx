'use client'
import ImageUploader from "@/components/rename-jpg/ImageUploader";
import ImageRenamer from "@/components/rename-jpg/ImageRenamer";

const Page = () => {
    return (
        <div className="h-screen mx-auto p-4">
            <h1 className="text-3xl font-bold text-center my-8">Image Renamer</h1>
            <ImageUploader />
            <ImageRenamer />
        </div>
    )
}

export default Page;