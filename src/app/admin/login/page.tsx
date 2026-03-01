'use client'

import { useState } from 'react'
import { login } from '@/app/actions/auth'
import { Lock, Loader2, UserCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError(null)
        const res = await login(formData)
        if (res?.error) {
            setError(res.error)
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative">
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:shadow transition-all">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Submit
                </Link>
            </div>
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-8 pb-6 border-b border-slate-100">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                            <Lock className="w-8 h-8" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Admin Access</h2>
                    <p className="text-center text-sm text-gray-500">
                        Sign in to review proofs and manage the platform
                    </p>
                </div>

                <div className="p-8">
                    <form action={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 mb-4">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserCircle className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="admin@company.com"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Log In'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}
