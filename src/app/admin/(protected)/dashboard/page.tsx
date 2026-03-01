import { createClient } from '@/lib/supabase/server'
import SubmissionsList from '@/components/SubmissionsList'
import { LayoutDashboard } from 'lucide-react'

export const revalidate = 0

export default async function DashboardPage() {
    const supabase = await createClient()

    // Fetch summary stats
    const { count: pendingCount } = await supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    const { count: acceptedCount } = await supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'accepted')
    const { count: rejectedCount } = await supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'rejected')

    // Fetch pending submissions
    const { data: pendingSubmissions } = await supabase
        .from('submissions')
        .select('*, metric_types(name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold flex items-center text-slate-800">
                    <LayoutDashboard className="w-6 h-6 mr-3 text-blue-500" />
                    Admin Dashboard
                </h1>
                <p className="mt-2 text-slate-500">Overview of the platform activity and pending items.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Pending Reviews</p>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{pendingCount || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Accepted</p>
                    <p className="text-4xl font-bold text-emerald-500 mt-2">{acceptedCount || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Rejected</p>
                    <p className="text-4xl font-bold text-red-500 mt-2">{rejectedCount || 0}</p>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4 text-slate-800">Needs Review</h2>
                <SubmissionsList submissions={pendingSubmissions || []} />
            </div>
        </div>
    )
}
