import { api } from '@/lib/axios';
import { CurrentUserType } from './types';
import { AxiosError } from 'axios';


export const getCurrentUser = async (): Promise<CurrentUserType | null> => {
    // éviter l'accès à localStorage côté serveur
    if (typeof window === "undefined") return null

    const access = localStorage.getItem('access');
    if (!access) return null;

    try {
        const response = await api.get('/me/');
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            // On ignore silencieusement les 401
            if (error.response?.status !== 401) {
                console.error("Erreur récupération utilisateur:", error);
            }
        } else {
            // Autres erreurs (rare)
            console.error("Erreur inconnue:", error);
        }
        throw error;
    }
}