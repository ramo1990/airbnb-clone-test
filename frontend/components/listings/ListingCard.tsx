'use client'

// import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react'
import Image from 'next/image'
import { ListingType } from '@/lib/types';
// import HeartButton from '../HeartButton';
import { Button } from '../ui/button';
import { getCountries } from '@/lib/getCountries';


interface ListingCardProps {
    data: ListingType;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId: string;
}

const ListingCard = ({data, onAction, disabled, actionLabel, actionId}: ListingCardProps) => {
    // const router = useRouter()
    const {getByValue} = getCountries()

    const location = getByValue(data.country_code)

    const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        if (disabled) {
            return
        }
        onAction?.(actionId)
    }, [onAction, actionId, disabled])

    const locationLabel = data.city_name
    ? `${data.city_name}, ${location?.label}`           // ville + pays
    : `${location?.label}, ${location?.region}`;        // pays + continent

    return (
        <div 
            // onClick={() => router.push(`/listing/${data.id}`)} 
            className='col-span-1 cursor-pointer group'
        >
            <div className='flex flex-col gap-2 w-full'>
                
                <div className='aspect-square w-full relative overflow-hidden rounded-xl'>
                    <Image 
                        fill 
                        alt='listing' 
                        src={data.images[0]} 
                        className='object-cover group-hover:scale-110 transition'  
                        sizes="(max-width: 640px) 100vw,
                            (max-width: 1024px) 50vw,
                            (max-width: 1280px) 33vw,
                            25vw"
                        loading="eager"
                    />
                    {/* <div className='absolute top-3 right-3'>
                        <HeartButton listingId={data.id} />
                    </div> */}
                </div>

                <div className='font-semibold text-lg'>
                    {locationLabel}
                </div>

                <div className='font-light text-neutral-500'>
                    {/* {reservationDate || data.categories} */} 
                    {data.categories}
                </div>

                <div className='flex flex-row items-center gap-1'>
                    <div className='font-semibold'>
                        {data.price} $
                    </div>
                </div>

                {onAction && actionLabel && (
                    <Button disabled size='sm' label={actionLabel} onClick={handleCancel} />
                )}
            </div>
        </div>
    )
}

export default ListingCard