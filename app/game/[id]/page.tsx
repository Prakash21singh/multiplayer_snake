import MultiplayerMode from '@/components/custom/multiplayer-mode';
import Link from 'next/link';
import React from 'react'

type Props = {
    params: Promise<{id: string}>
}

async function page(props: Props) {
   const room = await props.params

    if(!room.id) return (
        <div className="w-full h-screen flex items-center justify-center bg-black text-white">
            <div className="bg-[#131313] text-stone-400 p-8 min-w-96 ">
                <h1 className="font-semibold">No Room Id!</h1>
                <p className="text-sm leading-7 tracking-wide">Try joining the room or create your own.</p>
                <p className="text-sm my-4">Navigate to <Link href={"/"} className="underline text-white">Home</Link></p>
            </div>
        </div>
    );
    
    return (
        <div className="w-full h-screen bg-black font-inter text-white">
            <MultiplayerMode id={room.id}/>
        </div>
    )
}

export default page