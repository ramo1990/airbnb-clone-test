"use client"

import React, { useEffect, useState } from 'react'
import { CurrentUserType, ListingType } from '@/lib/types'
import Skeleton from '@/components/pageSkeleton'
import EmptyState from '@/components/EmptyState'
import FavoriteClient from './FavoriteClient'
import { getFavoriteListings } from '@/lib/getFavoriteListings'
import { getCurrentUser } from '@/lib/getCurrentUser'

const FavoritesPage = () => {
    const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null)
    const [favorites, setFavorites] = useState<ListingType[]>([])
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
                const favs = await getFavoriteListings()

                setCurrentUser(user)
                setFavorites(favs)
            } catch {
                setError("Échec du chargement de vos favoris. Veuillez réessayer")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    if (loading) return <Skeleton />

    if (error) {
        return (<EmptyState title='Erreur' subtitle={error} />)
    }

    if (!currentUser) {
        return <EmptyState title='Non autorisé' subtitle='Veuillez vous connecter' />
    }

    if (favorites.length === 0) {
        return <EmptyState title='Aucun favori trouvé' subtitle="Vous n'avez ajouter aucune annonce dans vos favoris" />
    }


    return (
        <FavoriteClient listings={favorites} currentUser={currentUser} />
    )
}

export default FavoritesPage