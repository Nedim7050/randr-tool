import { logout } from '@/app/actions/auth'
import { LayoutDashboard, ListTodo, History, LogOut, Trophy } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-auto md:h-screen z-10">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between md:justify-start">
                    <h2 className="text-xl font-bold tracking-tight text-slate-800">Admin Panel</h2>
                </div>

                <nav className="flex-1 px-4 py-6 text-sm font-medium space-y-1">
                    <Link href="/admin/dashboard" className="flex items-center px-3 py-2.5 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        <LayoutDashboard className="w-5 h-5 mr-3 text-slate-400" />
                        Dashboard
                    </Link>
                    <Link href="/admin/submissions" className="flex items-center px-3 py-2.5 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        <ListTodo className="w-5 h-5 mr-3 text-slate-400" />
                        Pending Reviews
                    </Link>
                    <Link href="/admin/history" className="flex items-center px-3 py-2.5 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        <History className="w-5 h-5 mr-3 text-slate-400" />
                        Review History
                    </Link>
                    <Link href="/leaderboard" className="flex items-center px-3 py-2.5 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        <Trophy className="w-5 h-5 mr-3 text-slate-400" />
                        Leaderboard
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="mb-4 px-2">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Logged in as</p>
                        <p className="text-sm text-slate-900 truncate mt-1">{user.email}</p>
                    </div>
                    <form action={logout}>
                        <button type="submit" className="w-full flex justify-center items-center px-4 py-2 border border-slate-200 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            <main className="flex-1 p-6 sm:p-10 overflow-auto">
                {children}
            </main>
        </div>
    )
}
