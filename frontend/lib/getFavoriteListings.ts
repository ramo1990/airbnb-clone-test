import { api } from "./axios"
import type { ListingType } from "./types"

export async function getFavoriteListings(): Promise<ListingType[]> {
    try {
        const response = await api.get("/favorites/")
        return response.data
    } catch ( error) {
        console.error("Erreur lors de la recuperation des annonces favorites:", error)
        throw error
    }
}