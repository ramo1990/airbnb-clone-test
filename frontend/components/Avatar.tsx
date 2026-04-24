import Image from 'next/image'


interface AvatarProps {
  src :string | null | undefined
}

const Avatar = ({src}: AvatarProps) => {
  return (
    <Image 
        className='rounded-full'
        height={30}
        width={30}
        alt='Avatar'
        src={src || "/placeholder.png"} // image à télécharger sur google
    />
  )
}

export default Avatar