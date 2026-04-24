"use client"

import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { SubmitHandler, useForm } from 'react-hook-form'
import useRegisterModal from '@/lib/useRegisterModal'
import Modal from './Modal'
import Input from '../inputs/Input'
import { toast } from 'react-hot-toast'
import { Button } from '../ui/button'
import { api } from '@/lib/axios'
import { LoginFormValues } from '@/lib/types'
import Heading from '../Headings'
import useLoginModal from '@/lib/useLoginModal'
import useAuthStore from '@/lib/useAuthStore'
import { FaFacebook } from 'react-icons/fa'
import { AxiosError } from 'axios'
import { signIn } from "next-auth/react"


const LoginModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal()
    const [isLoading, setIsLoading] = useState(false)
    const loadUser = useAuthStore((state) => state.loadUser)

    const {register, handleSubmit, formState: {errors}} = useForm<LoginFormValues>({
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
        try {
            setIsLoading(true);
	        loginModal.onClose();

            // Login
            const tokensRes = await api.post('/login/', { email: data.email, password: data.password })
            const {access, refresh} = tokensRes.data
	        if (typeof window !== "undefined") {
                localStorage.setItem('access', access)
                localStorage.setItem('refresh', refresh)
	        }

            await loadUser()

            toast.success('Connexion réussie')
        } catch (error) { 
            const err = error as AxiosError;
            console.error(' Erreur de connexion:', err.response?.data || error)
            toast.error('Email ou mot de passe incorrect'); // affiche une erreur
        } finally {
            setIsLoading(false)
        }
    }

    // Fonction réutilisable pour Google & Facebook
    const handleSocialLogin = async (provider: "google" | "facebook") => {
        const res = await signIn(provider, { redirect: false })

        if (res?.ok) {
            await loadUser()
            window.location.reload()
        }
    }

    // Contenu du corps
    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading  
                title='Bon retour'
                subtitle='Connectez-vous à votre compte !'
            />
            <Input id='email' label='Email' disabled={isLoading} register={register} errors={errors} required />
            <Input id='password' type='password' label='Mot de passe' disabled={isLoading} register={register} errors={errors} required />
        </div>
    )
    
    // Contenu du pied de page
    const footerContent = (
        <div className='flex flex-col gap-4'>
            <hr />
            <Button 
                variant="outline" 
                label='Google' 
                icon={FcGoogle}
                onClick={() => handleSocialLogin("google")}
            />
            <Button 
                variant="outline" 
                label='Facebook' 
                icon={FaFacebook}
                onClick={() => handleSocialLogin("facebook")}
            />
            <div className='text-neutral-500 text-center mt-4 font-light'>
                <div className='justify-center flex flex-row items-center gap-2'>
                    Vous n’avez pas de compte ?
                    <div 
                        onClick={() => {
                            loginModal.onClose()
                            registerModal.onOpen()
                        }}
                        className='text-neutral-950 cursor-pointer hover:underline'>
                            Inscrivez-vous                
                    </div>
                </div>
            </div>
        </div>
    )
    
    return (
        <Modal 
            disabled= {isLoading}
            isOpen= {loginModal.isOpen}
            title='Se connecter'
            actionLabel='Continuer'
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
            />
    )
}

export default LoginModal