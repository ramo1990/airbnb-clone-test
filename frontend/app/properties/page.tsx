"use client"

import React, { useEffect, useState } from 'react'
import { CurrentUserType, ListingType } from '@/lib/types'
import EmptyState from '@/components/EmptyState'
import { getUserListings } from '@/lib/getUserListings'
import { getCurrentUser } from '@/lib/getCurrentUser'
import PropertiesClient from './PropertiesClient'
import PageSkeleton from '@/components/pageSkeleton'

const PropertiesPage = () => {
    const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null)
    const [listings, setListings] = useState<ListingType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                const user = await getCurrentUser()
                if (!user) {
                    setLoading(false)
                    return
                }
                const res = await getUserListings()

                setCurrentUser(user)
                setListings(res)
            } catch {
                setError("Échec du chargement de vos logements. Veuillez réessayer")
            } finally {
                setLoading(false)
            }
            
        }
        loadData()
    }, [])

    if (loading) return <PageSkeleton />

    if (error) {
        return (<EmptyState title='Erreur' subtitle={error} />)
    }

    if (!currentUser) {
        return <EmptyState title='Non autorisé' subtitle='Veuillez vous connecter' />
    }

    if (listings.length === 0) {
        return <EmptyState title='Aucun logement trouvé' subtitle="Il semble que vous n'ayez aucun logement pour le moment" />
    }


    return (
        <PropertiesClient listings={listings} currentUser={currentUser} />
    )
}

export default PropertiesPage