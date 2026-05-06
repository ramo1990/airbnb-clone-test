"use client"

import { CurrentUserType, ListingType, ReservationType } from '@/lib/types'
import dynamic from 'next/dynamic'
import { categoryItems } from '@/components/navbars/Category'
import Container from '@/components/Containers'
import ListingHead from '@/components/listings/ListingHead'
import ListingInfo from '@/components/listings/ListingInfo'
import { getCountries } from '@/lib/getCountries'
import { useMemo, useState } from 'react'
import { differenceInCalendarDays, eachDayOfInterval, parseISO, startOfDay } from 'date-fns'
import useLoginModal from '@/lib/useLoginModal'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'
import ListingReservation from '@/components/listings/Listingreservation'
import { Range } from 'react-date-range'


const ListingMap = dynamic(() => import("@/components/Map"), {ssr: false})


interface ListingClientProps {
    listing: ListingType
    currentUser: CurrentUserType | null
    reservations?: ReservationType[]
}

const initialDateRange: Range = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

const ListingClient = ({listing, currentUser, reservations}: ListingClientProps) => {
    const {getByValue} = getCountries()
    const country = getByValue(listing.country_code)
    const loginModal = useLoginModal()
    const [isLoading, setisLoading] = useState(false)
    const [dateRange, setDateRange] = useState<Range>(initialDateRange)
    const router = useRouter()

    const price = Number(listing.price)

    const disabledDates = useMemo(() => {
        const dates: Date[] = [];

        (reservations ?? []).forEach((reservation) => {
            const start = startOfDay(parseISO(reservation.startDate))
            const end = startOfDay(parseISO(reservation.endDate))

            const range = eachDayOfInterval({start, end})
            dates.push(...range)
        })
        return dates
    }, [reservations])

    const onCreateReservation = () => {
        if (!currentUser) {
            return loginModal.onOpen()
        }

        if (!dateRange.startDate || !dateRange.endDate) {
            toast.error("Veuillez selectionner des dates")
            return
        }

        if (dateRange.startDate >= dateRange.endDate) {
            toast.error("La date de fin doit être après la date de début")
            return
        }

        setisLoading(true)

        const formatDate = (date: Date) => date.toLocaleDateString("en-CA")

        api.post("/reservations/", {
            totalPrice,
            startDate: formatDate(dateRange.startDate),
            endDate: formatDate(dateRange.endDate),
            listingId: listing?.id
        })
        .then(() => {
            toast.success("Annonce réservée")
            setDateRange(initialDateRange)
            router.push("/trips")
        })
        .catch(() => {
            toast.error("Une erreur s'est produite")
        })
        .finally(() => {
            setisLoading(false)
        })
    }
    
    const dayCount = dateRange.startDate && dateRange.endDate ? differenceInCalendarDays(dateRange.endDate, dateRange.startDate) : 0
    const totalPrice = dayCount > 0 ? dayCount * price : price
    
    let coordinates: [number, number]
    if (listing.city_lat && listing.city_lng) {
        coordinates = [listing.city_lat , listing.city_lng]
    } else if (country?.latlng) {
        coordinates = [country.latlng[0], country.latlng[1]]
    } else {
        coordinates =[0, 0]
    }

    const category = useMemo(() =>{
        return categoryItems.find((item) => listing.categories.includes(item.label))
    }, [listing.categories])


    return (
        
        <Container>
            <div className='max-w-5xl mx-auto'>
                <div className='flex flex-col gap-6'>

                    <ListingHead 
                        title={listing.title}
                        images={listing.images}
                        locationValue={listing.country_code}
                        city={listing.city_name}
                        id={listing.id}
                        currentUser={currentUser}
                    />

                    <div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'>
                        <div className='col-span-4'>
                            <ListingInfo 
                                user={listing.owner}
                                category={category}
                                description={listing.description}
                                roomCount={listing.room_count}
                                guestCount={listing.guest_count}
                                bathroomCount={listing.bathroom_count}
                            />
                        </div>

                        <div className='order-first mb-10 md:order-last md:col-span-3'>
                            <div className='sticky top-24'>
                                <ListingReservation 
                                    price={price}
                                    totalPrice={totalPrice}
                                    onChangeDate={(value) => setDateRange(value)}
                                    dateRange={dateRange}
                                    onSubmit={onCreateReservation}
                                    disabled={isLoading}
                                    disabledDates={disabledDates}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='w-full h-100 mt-10'>
                        <ListingMap center={coordinates} />
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ListingClient