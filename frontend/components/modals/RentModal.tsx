'use client'

import { useMemo, useState } from 'react'
import Modal from './Modal'
import useRentModal from '@/lib/useRentModal'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Heading from '../Headings'
import { categoryItems } from '../navbars/Category'
import CategoryInput from '../inputs/CategoryInput'
import CountrySelect from '../inputs/CountrySelect'
import dynamic from 'next/dynamic'
import CitySelect from '../inputs/CitySelect'
import { citiesByCountry } from '@/lib/cities'
import { haversineDistance } from '@/lib/distance'
import { findCountryFromCoords } from '@/lib/findCountry'
import Counter from '../inputs/Counter'
import MultiImageUpload from '../inputs/ImageUpload'
import Input from '../inputs/Input'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'


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
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const LocationMap = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [])

    const {setValue, watch, register, formState: {errors,}, handleSubmit, reset} = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            city: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            images: [],
            price: 1,
            title: '',
            description: ''

        }
    })

    // eslint-disable-next-line react-hooks/incompatible-library
    const category = watch('category')
    const location = watch('location')
    const city = watch('city')
    const guestCount = watch('guestCount')
    const roomCount = watch('roomCount')
    const bathroomCount = watch('bathroomCount')
    const images = watch('images')

    const countryCode = location?.value

    const cities = useMemo(() => {
        return countryCode ? citiesByCountry[countryCode] || [] : []
    }, [countryCode])

    // trouver la ville la plus proche
    const findClosestCity = (coords: [number, number], list: {name: string; latlng: [number, number]} []) => {
        if (!list || list.length === 0) return null
      
        let closest = null
        let minDistance = Infinity
      
        for (const c of list) {
          const dist = haversineDistance(coords, c.latlng)
          if (dist < minDistance) {
            minDistance = dist
            closest = c
          }
        }
      
        return closest
    }

    // handleMapClick est appelée quand l’utilisateur clique sur la carte Leaflet.
    const handleMapClick = (coords: [number, number]) => {
        const [lat, lng] = coords // On récupère les coordonnées du clic
        const detectedCountry = findCountryFromCoords(lat, lng) // On essaie de détecter le pays automatiquement
    
        if (detectedCountry) {
            setCustomValue("location", detectedCountry) // Si un pays est détecté → on met à jour location
            
            const countryCities = citiesByCountry[detectedCountry.value] || [] // On récupère la liste des villes de ce pays
            const closestCity = findClosestCity(coords, countryCities) // On cherche la ville la plus proche du clic
            
            if (closestCity) {
                setCustomValue("city", closestCity) // Si une ville est trouvée → on met à jour city
            }
        } else { // Si aucun pays n’est détecté, On garde l’ancien pays si possible
            setCustomValue("location", {
                ...(location || {}),
                latlng: coords,
            })
        }
    }

    const center = useMemo(() => {
        if (!location) return undefined

        const countryCities = citiesByCountry[location.value] || []

        const isCityValid = countryCities.some(c => c.name === city?.name)

        return isCityValid ? city?.latlng : location.latlng
    }, [location, city])

    const setCustomValue = <T,>(id: string, value: T) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        })
    }

    // 5 villes les plus proches d’une ville
    const nearbyCities = useMemo(() => {
        if (!location?.latlng) return []

        const countryCities = citiesByCountry[location.value] || []

        return countryCities
            .map(city => ({
                name: city.name,
                latlng: city.latlng,
                distance: haversineDistance(location.latlng, city.latlng)
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5) // les 5 plus proches
    }, [location])


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

    const validateCurrentStep = (data: FieldValues, step: STEPS) => {
        switch (step) {
          case STEPS.CATEGORY:
            if (!data.category) {
              toast.error('Veuillez sélectionner au moins une catégorie')
              return false
            }
            return true
      
            case STEPS.LOCATION:
                if (!data.location) {
                toast.error('Veuillez sélectionner un pays')
                return false
                }
                return true // city est optionnelle
      
            case STEPS.IMAGES:
                if (!data.images || data.images.length === 0) {
                toast.error('Veuillez télécharger au moins une image')
                return false
                }
                return true
      
            default:
                return true
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) {
            // Validate current step before advancing
            const isValid = validateCurrentStep(data, step)
            if (!isValid) {
                return
            }
            return onNext()
        }

        setIsLoading(true)

        console.log("Données envoyées à django:", data)
        
        api.post('/listing/', data)
        .then(() => {
            toast.success('Annonce créée')
            router.refresh()
            reset()
            setStep(STEPS.CATEGORY)
            rentModal.onClose()
        })
        .catch((error) => {
	        const message = error.response?.data?.message || error.message || "Une erreur s'est produite"
            toast.error(`Erreur lors de la creation de votre annonce: ${message}`)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

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
                            setCustomValue('city', null) // reset city when country changes
                            setCustomValue('location', value)
                        }}
                    />
                </div>

                <div className="relative z-20 text-neutral-900">
                    {cities.length > 0 && (
                        <CitySelect 
                            cities={cities}
                            value={city}
                            onChange={(value) => setCustomValue('city', value)}
                        />
                    )}
                </div>

                {/* Carte */}
                <div className="relative z-10">
                    <LocationMap 
                        center={center}
                        onClickMap={handleMapClick}
                        nearbyCities={nearbyCities}
                    />
                </div>
            </div>
        )
    }

    // Listing 3: INFO
    if (step === STEPS.INFO) {        
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Partagez les informations de votre logement" subtitle="Quels équipements proposez-vous ?" />
                <Counter 
                    title="Voyageurs"
                    subtitle="Combien de voyageurs acceptez-vous ?"
                    value={guestCount}
                    onChange={(value) => setCustomValue("guestCount", value)}
                />
                <Counter 
                    title="Chambres "
                    subtitle="Combien de chambres avez-vous ?"
                    value={roomCount}
                    onChange={(value) => setCustomValue("roomCount", value)}
                />
                <Counter 
                    title="Salle de bain"
                    subtitle="Combien de salle de bain avez-vous ?"
                    value={bathroomCount}
                    onChange={(value) => setCustomValue("bathroomCount", value)}
                />
            </div>
        )
    }

    // Listing 4: Images
    if (step === STEPS.IMAGES) {        
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading title='Ajoutez des photos de votre logement' subtitle='Montrez aux voyageurs à quoi ressemble votre logement !'/>
                <MultiImageUpload 
                    value={images} 
                    onChange={(urls) => setCustomValue('images', urls)} 
                />
            </div>
        )
    }

    // Listing 5: DESCRIPTION
    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Comment décririez-vous votre logement ?" subtitle="Une description courte et concise est idéale" />
                <Input id='title' label="Titre" disabled={isLoading} register={register} errors={errors} required />
                
                <hr />
                <div className="flex flex-col gap-2">
                    <label className="text-neutral-950 font-medium"> Description</label>
                    <textarea 
                        id="description"
                        {...register("description", {required: true})}
                        disabled={isLoading}
                        className={`w-full p-4 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2
                            focus:ring-neutral-950 resize-none h-32 text-neutral-950
                            ${errors.description ? "border-red-500 focus:ring-red-500" : "border-neutral-300 focus:ring-neutral-950"}
                            `}
                        placeholder="Decrivez votre logement"
                    />
                </div>
            </div>
        )
    }

    // Etape 6: Prix
    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Définissez maintenant votre prix" subtitle="Combien facturez-vous par nuit ?" />
                <Input id='price' label="Prix" formatPrice type="number" disabled={isLoading} register={register} errors={errors} rules={{
                    valueAsNumber: true,
                    min: {value: 1, message: "Le prix doit être au moins de 1"}
                }}
                required 
                />
            </div>
        )
    }


    return (
        <Modal 
            isOpen={rentModal.isOpen} 
            onClose={rentModal.onClose}  
            onSubmit={handleSubmit(onSubmit)} 
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title='Devenir hôte'
            body={bodyContent}
        />
    )
}

export default RentModal