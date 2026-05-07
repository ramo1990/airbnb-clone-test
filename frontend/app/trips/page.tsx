"use client"

import { getUserReservations } from '@/lib/getReservations'
import { CurrentUserType, ReservationType } from '@/lib/types'
import { useEffect, useState } from 'react'
import TripsClient from './TripsClient'
import EmptyState from '@/components/EmptyState'
import { getCurrentUser } from '@/lib/getCurrentUser'
import PageSkeleton from '@/components/pageSkeleton'

const TripsPage = () => {
    const [currentUser, setCurrentUser] =useState<CurrentUserType | null>(null)
    const [reservations, setReservations] = useState<ReservationType[]>([])
    const [loading, setLoading] =useState(true)
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
        const loadData = async () => {
            try {
                const user = await getCurrentUser()
                if (!user) {
                    setLoading(false)
                    return
                }
                const res = await getUserReservations()
                setCurrentUser(user)
                setReservations(res)
            } catch {
                setError("Échec du chargement de vos voyages. Veuillez réessayer")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    if (loading) {
        return <PageSkeleton />
    }

    if (error) {
        return (<EmptyState title='Erreur' subtitle={error} />)
    }

    if (!currentUser) {
        return (<EmptyState title='Non autorisé' subtitle='Veuillez vous connecter' />)
    }

    if (reservations.length === 0) {
        return (<EmptyState title='Aucun voyage trouvé' subtitle="Il semble que vous n'avez réservé aucun voyage" />)
    }

    return (
        <TripsClient reservations={reservations} currentUser={currentUser} />
    )
}

export default TripsPage