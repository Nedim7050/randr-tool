'use client'

import { useState } from 'react'
import { submitProof } from '@/app/actions/submit-proof'
import { UploadCloud, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type SubmissionFormProps = {
    metrics: { id: string; name: string; points: number }[]
}

export default function SubmissionForm({ metrics }: SubmissionFormProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const [filePreview, setFilePreview] = useState<string | null>(null)
    const [fileType, setFileType] = useState<'image' | 'video' | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 100 * 1024 * 1024) { // 100MB limit
                setError('File size must be less than 100MB')
                setFilePreview(null)
                setFileType(null)
                e.target.value = ''
                return
            }
            setError(null)
            const url = URL.createObjectURL(file)
            setFilePreview(url)
            setFileType(file.type.startsWith('video') ? 'video' : 'image')
        } else {
            setFilePreview(null)
            setFileType(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        try {
            const res = await fetch('/api/submit-proof', {
                method: 'POST',
                body: formData
            })

            const response = await res.json()

            if (!res.ok || response?.error) {
                setError(response?.error || 'Failed to submit form.')
            } else if (response?.success) {
                router.push('/thank-you')
            }
        } catch (err) {
            console.error('Client catch error:', err)
            setError('An unexpected error occurred. Please try again.')
        } finally {
            if (!error) setLoading(false) // it will redirect on success, so we leave it loading if successful
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" name="firstName" id="firstName" required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Jane" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" name="lastName" id="lastName" required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Doe" />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="jane.doe@company.com" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                    <select name="department" id="department" required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                        <option value="">Select Department</option>
                        <option value="ogv">ogv</option>
                        <option value="icx">icx</option>
                        <option value="ogt">ogt</option>
                        <option value="TM and IM">TM and IM</option>
                        <option value="BD">BD</option>
                        <option value="PM AND EWA">PM AND EWA</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance and legalities">Finance and legalities</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                    <input type="text" name="position" id="position" required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="" />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="metricTypeId" className="block text-sm font-medium text-gray-700">Metric Type / Activity</label>
                <select name="metricTypeId" id="metricTypeId" required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                    <option value="">Select Metric</option>
                    {metrics.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.name} ({m.points} points)
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Proof Upload (Image or Video)</label>
                <div className="relative group">
                    <label htmlFor="proofFile" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all overflow-hidden">
                        {filePreview ? (
                            <div className="relative w-full h-full">
                                {fileType === 'image' ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={filePreview} alt="Preview" className={`w-full h-full object-cover transition-opacity ${loading ? 'opacity-50 grayscale' : ''}`} />
                                ) : (
                                    <video src={filePreview} className={`w-full h-full object-cover transition-opacity ${loading ? 'opacity-50 grayscale' : ''}`} controls={!loading} />
                                )}
                                {loading && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-[2px]">
                                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
                                        <p className="text-blue-700 font-bold bg-white/80 px-4 py-1.5 rounded-full shadow-sm text-sm">Uploading File...</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-10 h-10 text-gray-400 mb-3 group-hover:text-blue-500 transition-colors" />
                                <p className="mb-2 text-sm text-gray-500 font-medium">
                                    <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-400">PNG, JPG, MP4 or MOV (MAX. 100MB)</p>
                            </div>
                        )}
                        <input id="proofFile" name="proofFile" type="file" className="hidden" accept="image/*,video/*" required onChange={handleFileChange} />
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 text-white text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center shadow-md hover:shadow-lg"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Uploading to secure storage... Please wait
                    </>
                ) : (
                    'Submit Proof'
                )}
            </button>
        </form>
    )
}
