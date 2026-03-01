import { createClient } from '@/lib/supabase/server'
import { Trophy, ArrowLeft, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import LeaderboardList from '@/components/LeaderboardList'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        // Option to redirect to /admin/login or just '/'
        return (
            <main className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-500 mb-6">The leaderboard is restricted to administrators.</p>
                    <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Back to Home
                    </Link>
                </div>
            </main>
        )
    }

    const { data: leaderboard, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('total_accepted_points', { ascending: false }) as unknown as { data: any[], error: any }

    if (error) {
        console.error('Error fetching leaderboard:', error)
    }

    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Submit
                        </Link>
                        {user && (
                            <Link href="/admin/dashboard" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Admin Dashboard
                            </Link>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold flex items-center text-gray-900">
                        <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
                        Leaderboard
                    </h1>
                    <div className="w-24"></div> {/* Balance header */}
                </div>

                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                    {error ? (
                        <div className="p-10 text-center text-red-500">
                            Failed to load leaderboard. Please try again later.
                        </div>
                    ) : !leaderboard || leaderboard.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trophy className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No entries yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Be the first to submit a proof and get on the board!</p>
                        </div>
                    ) : (
                        <LeaderboardList leaderboard={leaderboard} />
                    )}
                </div>
            </div>
        </main>
    )
}
