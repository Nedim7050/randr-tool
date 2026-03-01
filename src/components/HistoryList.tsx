'use client'

import { useState } from 'react'
import ReviewModal from '@/components/ReviewModal'
import { CheckCircle2, XCircle, Search, Eye } from 'lucide-react'

export default function HistoryList({ historyItems }: { historyItems: any[] }) {
    const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null)

    if (!historyItems || historyItems.length === 0) {
        return <div className="p-10 text-center text-slate-500">No review history yet.</div>
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Member</th>
                            <th className="px-6 py-4">Metric / Points</th>
                            <th className="px-6 py-4">Reviewed By</th>
                            <th className="px-6 py-4">Admin Note</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {historyItems.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {item.status === 'accepted' ? (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accepted
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                            <XCircle className="w-3.5 h-3.5 mr-1" /> Rejected
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900">{item.first_name} {item.last_name}</div>
                                    <div className="text-xs text-slate-500">{item.department}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-900">{item.metric_types?.name}</div>
                                    <div className="text-xs font-bold text-emerald-600">+{item.awarded_points} pts</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-900">{item.admin_profiles?.email || 'Unknown Admin'}</div>
                                    <div className="text-xs text-slate-500">{new Date(item.reviewed_at).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-slate-700 max-w-[150px] truncate" title={item.admin_note}>
                                        {item.admin_note || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setSelectedSubmission({
                                            id: item.id,
                                            first_name: item.first_name,
                                            last_name: item.last_name,
                                            email: item.email,
                                            department: item.department,
                                            metric: item.metric_types?.name,
                                            points: item.awarded_points,
                                            proof_type: item.proof_type,
                                            proof_url: item.proof_url,
                                            created_at: item.created_at,
                                            admin_note: item.admin_note
                                        })}
                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                    >
                                        <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedSubmission && (
                <ReviewModal submission={selectedSubmission} onClose={() => setSelectedSubmission(null)} mode="history" />
            )}
        </>
    )
}
