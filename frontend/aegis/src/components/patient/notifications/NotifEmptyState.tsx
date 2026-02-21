import { BellOff } from 'lucide-react'
import type { Filter } from './notifTypes'

export default function NotifEmptyState({ activeFilter }: { activeFilter: Filter }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <BellOff className="w-6 h-6 text-slate-400" />
            </div>
            <div className="text-center">
                <p className="text-slate-700 font-bold">No notifications</p>
                <p className="text-slate-400 text-sm mt-1">
                    {activeFilter === 'All'
                        ? "You're all caught up!"
                        : `No ${activeFilter.toLowerCase()} notifications`
                    }
                </p>
            </div>
        </div>
    )
}