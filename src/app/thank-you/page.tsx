import Link from 'next/link'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

export default function ThankYouPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center border border-slate-100">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Submission Successful!
                </h1>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Thank you for submitting your proof. An admin will review it shortly. Once accepted, your points will appear on the leaderboard.
                </p>

                <div className="space-y-4">
                    <Link href="/" className="w-full flex justify-center items-center py-4 px-6 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl transition-all shadow-md hover:shadow-lg">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Submit Another Proof
                    </Link>
                </div>
            </div>
        </main>
    )
}
