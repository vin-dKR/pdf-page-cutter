import { Button, Field, Input, Label } from "@headlessui/react"
import clsx from "clsx"
import { useState, type ChangeEvent } from "react"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { PDFDocument } from "pdf-lib"
import { usePDFDataStore } from "@/store-hooks/pdfDataStore"

interface PageGroup {
    lower: number
    higher: number
    name: string
}

const inputClass = clsx(
    'mt-1 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
    'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
)

const PdfPageSelector = () => {
    const pdfData = usePDFDataStore((state) => state.pdfData)
    const [pageGroup, setPageGroup] = useState<PageGroup>({ lower: 0, higher: 0, name: "" })
    const [pageGroups, setPageGroups] = useState<PageGroup[]>([])
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [warning, setWarning] = useState<string>("")

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPageGroup((prev) => ({ ...prev, [name]: name === "name" ? value : Number(value) }))
    }

    const handleAddOrEdit = () => {
        if (pageGroup.lower > 0 && pageGroup.higher >= pageGroup.lower && pageGroup.name.trim()) {
            setWarning("")
            if (editingIndex !== null) {
                setPageGroups((prev) =>
                    prev.map((g, i) => (i === editingIndex ? pageGroup : g))
                )
                setEditingIndex(null)
            } else {
                setPageGroups((prev) => [...prev, pageGroup])
            }
            setPageGroup({ lower: 0, higher: 0, name: "" })
        } else if (pageGroup.higher < pageGroup.lower) {
            setWarning("End page must be greater than or equal to start page.")
        } else {
            setWarning("Please fill all fields correctly.")
        }
    }

    const handleEdit = (idx: number) => {
        setEditingIndex(idx)
        setPageGroup(pageGroups[idx])
    }

    const handleDelete = (idx: number) => {
        setPageGroups((prev) => prev.filter((_, i) => i !== idx))
        if (editingIndex === idx) setEditingIndex(null)
    }

    const handleDownload = async () => {
        if (!pdfData) return
        const origPdf = await PDFDocument.load(pdfData)
        const zip = new JSZip()
        for (const group of pageGroups) {
            const newPdf = await PDFDocument.create()
            const pages = await newPdf.copyPages(
                origPdf,
                Array.from({ length: group.higher - group.lower + 1 }, (_, i) => group.lower - 1 + i)
            )
            pages.forEach((p) => newPdf.addPage(p))
            const pdfBytes = await newPdf.save()
            zip.file(`${group.name || `Chapter_${group.lower}_${group.higher}`}.pdf`, pdfBytes)
        }
        const zipBlob = await zip.generateAsync({ type: "blob" })
        saveAs(zipBlob, "chapters.zip")
    }

    const handleDownloadSingle = async (group: PageGroup) => {
        if (!pdfData) return
        const origPdf = await PDFDocument.load(pdfData)
        const newPdf = await PDFDocument.create()
        const pages = await newPdf.copyPages(
            origPdf,
            Array.from({ length: group.higher - group.lower + 1 }, (_, i) => group.lower - 1 + i)
        )
        pages.forEach((p) => newPdf.addPage(p))
        const pdfBytes = await newPdf.save()
        saveAs(new Blob([pdfBytes]), `${group.name || `Chapter_${group.lower}_${group.higher}`}.pdf`)
    }

    return (
        <div className="relative h-full border border-white/10 rounded-lg bg-white/10 p-6 shadow-sm overflow-hidden max-w-lg mx-auto">
            {/* Spiral Blur Background */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                <svg width="340" height="340" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="blur-2xl opacity-40">
                    <defs>
                        <radialGradient id="spiralWhite" cx="50%" cy="50%" r="50%" fx="50%" fy="50%" gradientTransform="rotate(45)">
                            <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <circle cx="170" cy="170" r="160" fill="url(#spiralWhite)" />
                    <path d="M170 170 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" stroke="#fff" strokeWidth="8" fill="none" opacity="0.2" />
                    <path d="M170 170 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" stroke="#fff" strokeWidth="4" fill="none" opacity="0.2" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold mb-1">Group Pages</h3>
            <div className='w-full border-white/50 border-t mb-3' />

            <div className="flex flex-row items-end gap-2 mb-4">
                <Field className="w-20 px-2">
                    <Label className="text-sm/6 font-medium text-white">Start</Label>
                    <Input name="lower" type="number" value={pageGroup.lower || ""} onChange={handleChange} className={inputClass} />
                </Field>
                <Field className="w-20 px-2">
                    <Label className="text-sm/6 font-medium text-white">End</Label>
                    <Input name="higher" type="number" value={pageGroup.higher || ""} onChange={handleChange} className={inputClass} />
                </Field>
                <Field className="flex-1 px-2">
                    <Label className="text-sm/6 font-medium text-white">Name</Label>
                    <Input name="name" value={pageGroup.name} onChange={handleChange} className={inputClass} />
                </Field>
                <Button
                    className="h-12 items-center gap-2 rounded-md bg-gray-700 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                    onClick={handleAddOrEdit}
                >
                    {editingIndex !== null ? "Update" : "Add"}
                </Button>
            </div>
            {warning && <div className="text-red-500 mb-2 text-sm font-medium">{warning}</div>}
            <ul className="divide-y divide-white/10 mb-4">
                {pageGroups.map((g, i) => (
                    <li key={i} className="flex gap-2 items-center py-2">
                        <span className="flex-1 text-white/90">
                            <span className="font-semibold">{g.name}</span> <span className="text-xs">({g.lower} - {g.higher})</span>
                        </span>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded" onClick={() => handleEdit(i)}>Edit</Button>
                        <Button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(i)}>Delete</Button>
                        <Button className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded" onClick={() => handleDownloadSingle(g)}>Download</Button>
                    </li>
                ))}
            </ul>
            {pageGroups.length > 0 && (
                <Button className="w-full mt-2 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold" onClick={handleDownload}>
                    Download All as ZIP
                </Button>
            )}
        </div>
    )
}

export default PdfPageSelector
