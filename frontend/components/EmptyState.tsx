'use client'

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import Heading from './Headings';


interface EmptyStateProps {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
}

const EmptyState = ({title= "Aucune correspondance exacte", subtitle="Essayez de modifier ou de supprimer certains de vos filtres", showReset}: EmptyStateProps) => {
    const router = useRouter()

    return (
        <div className='h-[60vh] flex flex-col gap-2 justify-center items-center '>
            <Heading center title={title} subtitle={subtitle} />
            {showReset && (
                <Button variant='outline' label='Supprimer tous les filtres' className="w-auto px-6 cursor-pointer hover:bg-neutral-200" onClick={() => router.push('/')} />
            )}
        </div>
    )
}

export default EmptyState