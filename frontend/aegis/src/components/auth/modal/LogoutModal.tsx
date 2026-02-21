import { LogOut, X } from 'lucide-react'

interface LogoutModalProps {
    onConfirm: () => void
    onCancel:  () => void
}

export default function LogoutModal({ onConfirm, onCancel }: LogoutModalProps) {
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4">

            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                    <X className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                    <h2 className="text-slate-900 font-extrabold text-lg">Log out of Aegis?</h2>
                    <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                        You'll need to sign back in to access your health dashboard and data.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors shadow-sm"
                    >
                        Yes, log out
                    </button>
                </div>
            </div>
        </div>
    )
}