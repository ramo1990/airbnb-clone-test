import Image from 'next/image'


interface AvatarProps {
  src :string | null | undefined
}

const Avatar = ({src}: AvatarProps) => {
  const validSrc = src && (src.startsWith('http') || src.startsWith('/')) ? src : "/placeholder.png"

  return (
    <Image 
        className='rounded-full'
        height={30}
        width={30}
        alt='Avatar'
        src={validSrc} // image à télécharger sur google
    />
  )
}

export default Avatar