'use client'

import { useState } from 'react'
import { actionResyncSheet } from '@/app/actions/submissions'
import { RefreshCw, Check, Loader2 } from 'lucide-react'

export default function ResyncButton() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleResync = async () => {
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const result = await actionResyncSheet()
            if (result.error) {
                setError(result.error)
            } else {
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
            }
        } catch (err) {
            setError('An unexpected error occurred.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-end">
            <button
                onClick={handleResync}
                disabled={loading}
                className="flex items-center px-4 py-2 border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium rounded-xl transition-all disabled:opacity-50"
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : success ? (
                    <Check className="w-4 h-4 mr-2 text-emerald-500" />
                ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {success ? 'Synced!' : 'Resync Google Sheet'}
            </button>
            {error && <span className="text-red-500 text-xs mt-2">{error}</span>}
        </div>
    )
}
