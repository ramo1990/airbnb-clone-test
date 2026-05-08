"use client"

import { useEffect, useState } from 'react'
import { CurrentUserType, ReservationType } from '@/lib/types'
import { getHostReservations } from '@/lib/getReservations'
import EmptyState from '@/components/EmptyState'
import { getCurrentUser } from '@/lib/getCurrentUser'
import ReservationClient from './reservationClient'
import PageSkeleton from '@/components/pageSkeleton'

const ReservationsPage = () => {
    const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null)
    const [hostReservations, setHostreservations] = useState<ReservationType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            const user = await getCurrentUser()
            if (!user) {
                setLoading(false)
                return
            }
            const host = await getHostReservations()

            setCurrentUser(user)
            setHostreservations(host)
            setLoading(false)
        }
        loadData()
    }, [])

    if (loading) return <PageSkeleton />

    if (!currentUser) {
        return <EmptyState title='Non autorisé' subtitle='Veuillez vous connecter' />
    }

    if (hostReservations.length === 0) {
        return <EmptyState title='Aucune reservation trouvée' subtitle="Vous n'avez aucune reservation sur vos biens" />
    }


    return (
        <ReservationClient reservations={hostReservations} currentUser={currentUser} />
    )
}

export default ReservationsPage