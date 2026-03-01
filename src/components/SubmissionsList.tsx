'use client'

import { useState } from 'react'
import ReviewModal from '@/components/ReviewModal'
import { Calendar, Tag, ChevronRight, Trash2, Loader2 } from 'lucide-react'
import { deleteSubmission } from '@/app/actions/submissions'
import { useRouter } from 'next/navigation'

export default function SubmissionsList({ submissions }: { submissions: any[] }) {
    const router = useRouter()
    const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to completely delete this submission?')) {
            setDeletingId(id)
            const result = await deleteSubmission(id)
            if (result?.error) {
                alert(`Error: ${result.error}`)
            } else {
                router.refresh()
            }
            setDeletingId(null)
        }
    }

    if (submissions.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm">
                No pending submissions to review.
            </div>
        )
    }

    return (
        <>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <ul className="divide-y divide-slate-100">
                    {submissions.map((sub) => (
                        <li key={sub.id} className="hover:bg-slate-50 transition-colors p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                        {sub.first_name} {sub.last_name}
                                    </p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                        {sub.department}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center"><Tag className="w-3 h-3 mr-1" /> {sub.metric_types?.name}</span>
                                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(sub.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                                <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full whitespace-nowrap">
                                    +{sub.awarded_points} pts
                                </div>
                                <div className="flex items-center gap-2 ml-auto sm:ml-0">
                                    <button
                                        onClick={() => handleDelete(sub.id)}
                                        disabled={deletingId === sub.id}
                                        className="inline-flex items-center justify-center w-9 h-9 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
                                        title="Delete Submission"
                                    >
                                        {deletingId === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => setSelectedSubmission({
                                            id: sub.id,
                                            first_name: sub.first_name,
                                            last_name: sub.last_name,
                                            email: sub.email,
                                            department: sub.department,
                                            metric: sub.metric_types?.name,
                                            points: sub.awarded_points,
                                            proof_type: sub.proof_type,
                                            proof_url: sub.proof_url,
                                            created_at: sub.created_at
                                        })}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                    >
                                        Review
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedSubmission && (
                <ReviewModal submission={selectedSubmission} onClose={() => setSelectedSubmission(null)} />
            )}
        </>
    )
}
