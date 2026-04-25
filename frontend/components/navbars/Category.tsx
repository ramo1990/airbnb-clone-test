"use client"

import {TbBeach, TbBuildingWarehouse, TbMountain} from 'react-icons/tb'
import { GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance, GiFarmTractor, GiHouse, GiIsland, GiTreehouse, GiWoodCabin} from 'react-icons/gi'
import { MdApartment, MdAutoAwesome, MdDirectionsBoat, MdLocationCity, MdOutlineMeetingRoom, MdOutlinePeople, MdOutlineVilla, MdStairs } from "react-icons/md";
import CategoryBox from '../CategoryBox';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaHome, FaHotel } from 'react-icons/fa';
import { IoDiamond } from "react-icons/io5";
import Container from '../Containers';


export const categoryItems = [
    {
        label: 'Appartement', icon: MdApartment, description: "Ce logement se situe dans un immeuble"
    },
    {
        label: 'Maison', icon: FaHome, description: "Un logement individuel indépendant"
    },
    {
        label: 'Studio', icon: MdOutlineMeetingRoom, description: "Un petit logement avec une seule pièce principale"
    },
    {
        label: 'Loft', icon: TbBuildingWarehouse, description: "Un grand espace ouvert avec un style industriel"
    },
    {
        label: 'Duplex', icon: MdStairs, description: "Ce logement se réparti sur deux étages"
    },
    {
        label: 'Villa', icon: MdOutlineVilla, description: "Une grande maison luxueuse"
    },
    {
        label: 'Chalet', icon: GiWoodCabin, description: "Ce logement en bois se situe en montagne"
    },
    {
        label: 'Littoral', icon: TbBeach, description: "Ce logement se situe près de la mer"
    },
    {
        label: 'Lac', icon: GiBoatFishing, description: "Ce logement se situe près d'un lac"
    },
    {
        label: 'Île', icon: GiIsland, description: "Ce logement se situe sur une île"
    },
    {
        label: 'MiniMaison', icon: GiHouse, description: "Une très petite maison optimisée"
    },
    {
        label: 'TreeHouse', icon: GiTreehouse, description: "Ce logement est construit dans les arbres"
    },
    {
        label: 'Grotte', icon: GiCaveEntrance, description: "Ce logement aménagé se situe dans une grotte"
    },
    {
        label: 'Flottante', icon: MdDirectionsBoat, description: "Ce logement se situe sur l'éau"
    },
    {
        label: 'Hôtel', icon: FaHotel, description: "Un établissement proposant des chambres à louer"
    },
    {
        label: 'Gîte', icon: GiFarmTractor, description: "Un logement meublé pour les vacances"
    },
    {
        label: 'Auberge', icon: MdOutlinePeople, description: "Un logement partagé"
    },
    {
        label: 'Château', icon: GiCastle, description: "Ce logement se situe dans un château"
    },
    {
        label: 'Penthouse', icon: MdLocationCity, description: "Un appartement de luxe en haut d'un immeuble"
    },
    {
        label: 'Moderne', icon: MdAutoAwesome, description: "Ce logement est moderne"
    },
    {
        label: 'Campagne', icon: TbMountain, description: "Ce logement est à la campagne"
    },
    {
        label: 'Désert', icon: GiCactus, description: "Ce logement se situe dans  le désert"
    },
    {
        label: 'Luxe', icon: IoDiamond, description: "Ce logement est luxueux"
    },
]

const Categories = () => {
    const params = useSearchParams()
    const category = params?.get('category')
    const pathname = usePathname()
    const isMainPage = pathname === '/'

    if (!isMainPage) return null

    return (
        <Container>
            <div className='pt-4 flex items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide'>
                {categoryItems.map((item) => (
                    <CategoryBox 
                        key={item.label}
                        label={item.label}
                        selected={category === item.label}
                        icon={item.icon}
                    />
                ))}
            </div>
        </Container>
    )
}

export default Categories