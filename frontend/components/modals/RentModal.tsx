'use client'

import { useMemo, useState } from 'react'
import Modal from './Modal'
import useRentModal from '@/lib/useRentModal'
import { FieldValues, useForm } from 'react-hook-form'
import Heading from '../Headings'
import { categoryItems } from '../navbars/Category'
import CategoryInput from '../inputs/CategoryInput'
import CountrySelect from '../inputs/CountrySelect'
import dynamic from 'next/dynamic'
// import CitySelect from '../inputs/CitySelect'
// import { citiesByCountry } from '@/lib/cities'
// import { haversineDistance } from '@/lib/distance'
// import { findCountryFromCoords } from '@/lib/findCountry'



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

    const LocationMap = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [])

    const {setValue, watch} = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            // city: null,
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
    const location = watch('location')
    // const city = watch('city')

    // const countryCode = location?.value

    // const cities = useMemo(() => {
    //     return countryCode ? citiesByCountry[countryCode] || [] : []
    // }, [countryCode])

    // trouver la ville la plus proche
    // const findClosestCity = (coords: number[], list: {name: string; latlng: number[]} []) => {
    //     if (!list || list.length === 0) return null
      
    //     let closest = null
    //     let minDistance = Infinity
      
    //     for (const c of list) {
    //       const dist = haversineDistance(coords, c.latlng)
    //       if (dist < minDistance) {
    //         minDistance = dist
    //         closest = c
    //       }
    //     }
      
    //     return closest
    // }

    // handleMapClick est appelée quand l’utilisateur clique sur la carte Leaflet.
    // const handleMapClick = (coords: [number, number]) => {
    //     const [lat, lng] = coords // On récupère les coordonnées du clic
    //     const detectedCountry = findCountryFromCoords(lat, lng) // On essaie de détecter le pays automatiquement
    
    //     if (detectedCountry) {
    //         setCustomValue("location", detectedCountry) // Si un pays est détecté → on met à jour location
            
    //         // const countryCities = citiesByCountry[detectedCountry.value] || [] // On récupère la liste des villes de ce pays
    //         // const closestCity = findClosestCity(coords, countryCities) // On cherche la ville la plus proche du clic
            
    //         // if (closestCity) {
    //         //     setCustomValue("city", closestCity) // Si une ville est trouvée → on met à jour city
    //         // }
    //     } else { // Si aucun pays n’est détecté, On garde l’ancien pays si possible
    //         setCustomValue("location", location ? { ...location, latlng: coords } : {latlng: coords})
    //     }
    // }


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

    const onNext = () => {
        setStep((value) => value <STEPS.PRICE ? value + 1 : value)
    }

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
    let bodyContent = (
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

    // Etape 2: location
    if (step === STEPS.LOCATION) {        
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading title='Où se situe votre logement ?' subtitle='Aidez les voyageurs à vous trouver'/>

                {/* Sélecteur de pays */}
                <div className="relative z-20 text-neutral-950">
                    <CountrySelect 
                        value={location}
                        onChange={(value) => {
                            setCustomValue('location', value)
                            // setCustomValue('city', null) // reset city when country changes
                        }}
                    />
                </div>

                {/* <div className="relative z-20 text-neutral-900">
                    {cities.length > 0 && (
                        <CitySelect 
                            cities={cities}
                            value={city}
                            onChange={(value) => setCustomValue('city', value)}
                        />
                    )}
                </div> */}

                {/* Carte */}
                <div className="relative z-10">
                    <LocationMap 
                        // center={city?.latlng ?? location?.latlng}
                        center={location?.latlng}
                        // onClickMap={handleMapClick}
                    />
                </div>
            </div>
        )
    }

    return (
        <Modal 
            isOpen={rentModal.isOpen} 
            onClose={rentModal.onClose}  
            onSubmit={onNext} 
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title='Devenir hôte'
            body={bodyContent}
        />
    )
}

export default RentModal