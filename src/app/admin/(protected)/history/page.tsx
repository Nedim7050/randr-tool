import { createClient } from '@/lib/supabase/server'
import { History as HistoryIcon } from 'lucide-react'
import HistoryList from '@/components/HistoryList'

export const revalidate = 0

export default async function HistoryPage() {
    const supabase = await createClient()

    // Fetch reviewed submissions
    const { data: historyItems, error } = await supabase
        .from('submissions')
        .select('*, metric_types(name), admin_profiles(email)')
        .neq('status', 'pending')
        .order('reviewed_at', { ascending: false })

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center text-slate-800">
                        <HistoryIcon className="w-6 h-6 mr-3 text-blue-500" />
                        Review History
                    </h1>
                    <p className="mt-2 text-slate-500">Recently accepted or rejected submissions.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {error ? (
                    <div className="p-10 text-center text-red-500">Failed to load history</div>
                ) : !historyItems || historyItems.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">No review history yet.</div>
                ) : (
                    <HistoryList historyItems={historyItems} />
                )}
            </div>
        </div>
    )
}
