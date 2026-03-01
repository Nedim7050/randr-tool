import { createClient } from '@/lib/supabase/server'
import SubmissionForm from '@/components/SubmissionForm'
import { Award, Trophy } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

export default async function Home() {
  const supabase = await createClient()

  // Fetch metric types for the dropdown
  const { data: metrics, error } = await supabase
    .from('metric_types')
    .select('id, name, points')
    .order('points', { ascending: false })

  return (
    <main className="min-h-screen bg-slate-50 relative">
      {/* Top Navigation */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <Link href="/admin" className="text-sm font-semibold text-slate-500 hover:text-slate-900 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:shadow transition-all">
          Admin Portal
        </Link>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              R&R signups system tool
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
              Submit your achievements and activities to earn points on the leaderboard.
            </p>
          </div>

          <div className="bg-white py-10 px-6 sm:px-10 rounded-3xl shadow-xl border border-slate-100">
            {error ? (
              <div className="text-center text-red-500 py-10">
                Failed to load required data. Please try again later.
              </div>
            ) : (
              <SubmissionForm metrics={metrics || []} />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
