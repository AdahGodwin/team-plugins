/**
 * Format an ISO date string into a human-readable date + time.
 * Example output: "20 Feb 2026, 08:12"
 */
export function formatDate(isoString: string): string {
    return new Date(isoString).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

/**
 * Returns a short relative time string from an ISO timestamp.
 * Example output: "2d ago", "5h ago", "Just now"
 */
export function timeAgo(isoString: string): string {
    const diffMs = Date.now() - new Date(isoString).getTime()
    const hours = Math.floor(diffMs / 3_600_000)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
}
