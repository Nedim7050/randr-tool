'use client'

import { useState } from 'react'
import { acceptSubmission, rejectSubmission, deleteSubmission } from '@/app/actions/submissions'
import { X, CheckCircle, XCircle, Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Submission = {
    id: string
    first_name: string
    last_name: string
    email: string
    department: string
    metric: string
    points: number
    proof_type: string
    proof_url: string
    created_at: string
}

export default function ReviewModal({ submission, onClose, mode = 'review' }: { submission: Submission, onClose: () => void, mode?: 'review' | 'history' }) {
    const router = useRouter()
    const [note, setNote] = useState('')
    const [loading, setLoading] = useState<'accept' | 'reject' | 'delete' | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleAction = async (action: 'accept' | 'reject' | 'delete') => {
        setLoading(action)
        setError(null)

        let result;
        if (action === 'accept') {
            result = await acceptSubmission(submission.id, note)
        } else if (action === 'reject') {
            result = await rejectSubmission(submission.id, note)
        } else {
            result = await deleteSubmission(submission.id)
        }

        if (result.error) {
            setError(result.error)
            setLoading(null)
        } else {
            router.refresh()
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">Review Submission</h3>
                    <button onClick={onClose} className="p-2 bg-white text-slate-400 hover:text-slate-600 rounded-full shadow-sm hover:shadow transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div>
                            <p className="text-slate-500 font-medium">Member</p>
                            <p className="font-semibold text-slate-900">{submission.first_name} {submission.last_name}</p>
                            <p className="hidden md:block text-slate-500">{submission.email}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium">Details</p>
                            <p className="font-semibold text-slate-900">{submission.metric} <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded ml-1">+{submission.points} pts</span></p>
                            <p className="text-slate-500">{submission.department}</p>
                        </div>
                    </div>

                    <div className="mb-6 rounded-xl overflow-hidden border border-slate-200 bg-slate-50/50 flex items-center justify-center p-2">
                        {submission.proof_type === 'image' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={submission.proof_url} alt="Proof" className="max-h-96 object-contain rounded-lg" />
                        ) : (
                            <video src={submission.proof_url} controls className="max-h-96 w-full rounded-lg" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Admin Note (Optional)</label>
                        <textarea
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-75 disabled:bg-slate-50"
                            placeholder={mode === 'history' ? "No note provided" : "Add a reason for rejection or a congrats note..."}
                            rows={3}
                            value={mode === 'history' ? (submission as any).admin_note || note : note}
                            onChange={(e) => setNote(e.target.value)}
                            disabled={mode === 'history'}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between gap-3">
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to completely delete this submission?')) {
                                handleAction('delete')
                            }
                        }}
                        disabled={loading !== null}
                        className="flex items-center px-4 py-2 border border-red-200 text-red-600 bg-white hover:bg-red-50 hover:text-red-700 font-medium rounded-xl transition-colors disabled:opacity-50"
                    >
                        {loading === 'delete' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                        Delete
                    </button>
                    <div className="flex gap-3">
                        {mode !== 'history' && (
                            <>
                                <button
                                    onClick={() => handleAction('reject')}
                                    disabled={loading !== null}
                                    className="flex items-center px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-medium rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {loading === 'reject' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleAction('accept')}
                                    disabled={loading !== null}
                                    className="flex items-center px-4 py-2 text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm hover:shadow font-medium rounded-xl transition-all disabled:opacity-50"
                                >
                                    {loading === 'accept' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                    Accept & Assign {submission.points} pts
                                </button>
                            </>
                        )}
                        {mode === 'history' && (
                            <button
                                onClick={onClose}
                                className="flex items-center px-6 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-medium rounded-xl transition-colors"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
