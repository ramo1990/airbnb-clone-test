'use client'

import React, { useMemo, useState } from 'react'
import Modal from './Modal'
import useRentModal from '@/lib/useRentModal'
import { FieldValues, useForm } from 'react-hook-form'
import Heading from '../Headings'
import { categoryItems } from '../navbars/Category'
import CategoryInput from '../inputs/CategoryInput'


enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

const RentModal = () => {
    const rentModal = useRentModal()
    const [step, setStep] = useState(STEPS.CATEGORY)

    const {setValue, watch} = useForm<FieldValues>({
        defaultValues: {
            category: '',
            // location: null,
            // guestCount: 1,
            // roomCount: 1,
            // bathroomCount: 1,
            // images: '', // modele listing de backend
            // price: 1,
            // title: '',
            // description: ''

        }
    })

    // eslint-disable-next-line react-hooks/incompatible-library
    const category = watch('category')

    const setCustomValue = (id: string, value: unknown) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        })
    }

    const onBack = () => {
        setStep((value) => value > STEPS.CATEGORY ? value - 1 : value)
    }

    // const onNext = () => {
    //     setStep((value) => value <STEPS.PRICE ? value + 1 : value)
    // }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Créer'
        }
        return 'Suivant'
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined
        }
        return 'Retour'
    }, [step])

    // let bodyContent = (
    const bodyContent = (
        <div>
            <Heading title='Lequel décrit le mieux votre logement ?' subtitle='Choississez une categorie' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-auto'>
                {categoryItems.map((item) => (
                    <div key={item.label} className='col-span-1'>
                        <CategoryInput 
                            onClick={() => setCustomValue('category', item.label)}
                            selected={category === item.label}
                            label={item.label}
                            description={item.description}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
    return (
        <Modal 
            isOpen={rentModal.isOpen} 
            onClose={rentModal.onClose}  
            onSubmit={rentModal.onClose} 
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title='Devenir hôte'
            body={bodyContent}
        />
    )
}

export default RentModal