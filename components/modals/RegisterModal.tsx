"use client"

import { useState } from 'react'
import axios from 'axios'
import { FcGoogle } from 'react-icons/fc'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import useRegisterModal from '@/lib/useRegisterModal'
import Modal from './Modal'
import Input from '../inputs/Input'
import { toast } from 'react-hot-toast'
import { FaFacebook } from 'react-icons/fa'
import { RegisterFormValues } from '@/lib/types'
import Heading from '../Headings'
import { Button } from '../ui/button'


const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const [isLoading, setIsLoading] = useState(false)
    const {register, handleSubmit, formState: {errors}} = useForm<RegisterFormValues>({defaultValues: {
        name: '',
        email: '',
        password: '',
    }})

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        console.log(data)

        axios.post('/register/', data)
        .then(() => {
            registerModal.onClose();
        })
        .catch(() => {
            toast.error("Une erreur s’est produite");
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading  
                title='Bienvenue sur airbnb'
                subtitle='Créer un compte'
            />
            <Input id='email' label='Email' disabled={isLoading} register={register} errors={errors} required />
            <Input id='name' label='Nom' disabled={isLoading} register={register} errors={errors} required />
            <Input id='password' type='password' label='Mot de passe' disabled={isLoading} register={register} errors={errors} required />
        </div>
    )

    const footerContent = (
        <div className='flex flex-col gap-4'>
            <hr />
            <Button 
                variant="outline" 
                label='Google' 
                icon={FcGoogle}
                onClick={() => {}}
            />
            <Button 
                variant="outline" 
                label='Facebook' 
                icon={FaFacebook}
                onClick={() => {}}
            />
            <div className='text-neutral-500 text-center mt-4 font-light'>
                <div className='justify-center flex flex-row items-center gap-2'>
                    Vous avez déjà un compte ?
                    <div 
                    onClick={registerModal.onClose}
                        className='text-neutral-950 cursor-pointer hover:underline'>
                        Se connecter
                    </div>
                </div>
            </div>
        </div>
    )
    
    return (
        <Modal 
            disabled= {isLoading}
            isOpen= {registerModal.isOpen}
            title='Inscription'
            actionLabel="S'inscrire"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default RegisterModal