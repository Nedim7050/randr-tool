import { createClient } from '@/lib/supabase/server'
import SubmissionsList from '@/components/SubmissionsList'
import { ListTodo } from 'lucide-react'

export const revalidate = 0

export default async function SubmissionsPage() {
    const supabase = await createClient()

    // Fetch only pending submissions
    const { data: pendingSubmissions } = await supabase
        .from('submissions')
        .select('*, metric_types(name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center text-slate-800">
                        <ListTodo className="w-6 h-6 mr-3 text-blue-500" />
                        Pending Reviews
                    </h1>
                    <p className="mt-2 text-slate-500">All submissions waiting for admin approval.</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold text-lg">
                    {pendingSubmissions?.length || 0}
                </div>
            </div>

            <SubmissionsList submissions={pendingSubmissions || []} />
        </div>
    )
}
