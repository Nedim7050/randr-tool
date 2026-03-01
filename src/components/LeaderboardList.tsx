'use client'

import { Trash2, Trophy, Medal, Loader2 } from 'lucide-react'
import { deleteMember } from '@/app/actions/submissions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LeaderboardList({ leaderboard }: { leaderboard: any[] }) {
    const router = useRouter()
    const [deletingEmail, setDeletingEmail] = useState<string | null>(null)

    const handleDelete = async (email: string) => {
        if (window.confirm(`Are you sure you want to completely delete all accepted submissions for ${email}? This will remove them from the leaderboard.`)) {
            setDeletingEmail(email)
            const res = await deleteMember(email)
            if (res.error) {
                alert(res.error)
            } else {
                router.refresh()
            }
            setDeletingEmail(null)
        }
    }

    if (!leaderboard || leaderboard.length === 0) {
        return (
            <div className="p-16 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No entries yet</h3>
                <p className="mt-1 text-sm text-gray-500">Be the first to submit a proof and get on the board!</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Rank</th>
                        <th className="px-6 py-4">Member</th>
                        <th className="px-6 py-4">Department / Position</th>
                        <th className="px-6 py-4 text-right">Points</th>
                        <th className="px-6 py-4 text-center">Admin Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {leaderboard.map((user, index) => (
                        <tr key={user.email} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-5 whitespace-nowrap">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold">
                                    {index === 0 ? <Trophy className="w-6 h-6 text-yellow-500" /> :
                                        index === 1 ? <Medal className="w-6 h-6 text-gray-400" /> :
                                            index === 2 ? <Medal className="w-6 h-6 text-amber-600" /> :
                                                <span className="text-gray-500 text-sm">{index + 1}</span>}
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                        {user.first_name[0]}{user.last_name[0]}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.first_name} {user.last_name}
                                        </div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="text-sm text-gray-900">{user.department}</div>
                                <div className="text-xs text-gray-500">{user.position}</div>
                            </td>
                            <td className="px-6 py-5 text-right whitespace-nowrap">
                                <div className="inline-flex items-center font-bold text-lg text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                    {user.total_accepted_points}
                                    <span className="text-xs ml-1 font-semibold text-emerald-500 uppercase">pts</span>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <button
                                    onClick={() => handleDelete(user.email)}
                                    disabled={deletingEmail === user.email}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Delete Member from Leaderboard"
                                >
                                    {deletingEmail === user.email ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
