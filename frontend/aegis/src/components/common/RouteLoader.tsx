import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PageLoader from './PageLoader'

export default function RouteLoader({ children }: { children: React.ReactNode }) {
    const location          = useLocation()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const t = setTimeout(() => setLoading(false), 1000)
        return () => clearTimeout(t)
    }, [location.pathname])

    if (loading) return <PageLoader />
    return <>{children}</>
}