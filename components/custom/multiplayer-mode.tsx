"use client"
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader
    ,DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/components/ui/dialog";
import { useSocketContext } from '@/contexts/socket-context';
import { Loader2 } from 'lucide-react';
type Props = {
    id: string
}

type Participants = {
    user: {
        id: string, 
        name: string
    }   
};

function MultiplayerMode({
    id
}: Props) {

  const {socket, sendMessage, id:userId, name, setName} = useSocketContext();
  const [room, setRoom] = useState<unknown | null>(null)
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(!name);
  const [isConnecting, setIsConnecting] = useState(false);
  const [inputState, setInputState] = useState("");
  const [participants, setParticipants] = useState<{user:{name:string; id:string}}[]>([]);
  const currentUser = useMemo(()=>{
    let user = {
        id : userId || "",
        name: name || ""
    }
    return user;
  }, [userId, name]);

  useEffect(() => {
    setIsOpen(!name);
  }, [name]);

  const organizer = useMemo(()=>{
    if(!room) return null;
    return (room as any).organizer as Participants
  },[socket?.readyState, id]);


    //  If the socket is open and the user is not in the room, join the room
    useEffect(()=>{
        if(isOpen) return;
        if(!socket) return ;

        socket.send(JSON.stringify({
            type: "JOIN_ROOM",
            payload: {
                roomId: id,
                userId,  
            }
        }));

    },[socket?.readyState, id, isOpen]);

  
  useEffect(() => {

        if (!socket) return;

        const handleOpen = () => {

            socket.send(JSON.stringify({
                type: "ROOM_AVAILABILITY_CHECK",
                payload: {
                    roomId: id    
                }
            }));

        };

        const handleMessage = (ev: MessageEvent) => {
            const message = JSON.parse(ev.data);

            console.log(message)
            switch (message.type) {

                case "ROOM_AVAILABILITY":

                    setLoading(false);
                    setRoom(message.payload.room);

                    break;
                case "JOINED_ROOM":
                    console.log(message.payload)
                    setIsOpen(false);
                    setIsConnecting(false); 
                    setParticipants(message.payload.participants)
                    break;
            }
        };

        if (socket.readyState === WebSocket.OPEN) {
            handleOpen();
        } else {
            socket.addEventListener("open", handleOpen);
        }

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("open", handleOpen);
            socket.removeEventListener("message", handleMessage);
        };

    }, [socket, id]);

    const handleJoinRoom = () => {
        if(!socket) return;

        setIsConnecting(true)
        setName(inputState)
        socket.send(JSON.stringify({
            type: "JOIN_ROOM",
            payload: {
                roomId: id,
                userId,  
            }
        }));
    }
  if(loading){
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#333]"/>
      </div>
    )
  }

  if(!room){
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
          <div className="bg-[#131313] text-stone-400 p-8 min-w-96 ">
              <h1 className="font-semibold">No Room Id!</h1>
              <p className="text-sm leading-7 tracking-wide">Try joining the room or create your own.</p>
              <p className="text-sm my-4">Navigate to <Link href={"/"} className="underline text-white">Home</Link></p>
          </div>
      </div>
    )
  }


  return (

    <section className="w-full max-w-6xl mx-auto p-4">
        <Dialog open={isOpen}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black/70" />

                <DialogContent className="bg-[#111] border border-[#333] text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Join Room</DialogTitle>
                    <DialogDescription className="text-white/50">
                    Enter your name to continue
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <input
                    type="text"
                    placeholder="Enter your name"
                    value={inputState}
                    onChange={(e) => setInputState(e.target.value)}
                    className="w-full rounded-lg bg-transparent text-white px-3 py-2 placeholder-white/30 border border-[#333] focus:outline-none"
                    />
                </div>

                <DialogFooter className="mt-4 bg-[#131313] border-t border-[#333]">
                    <button
                        onClick={handleJoinRoom}
                        className="w-full rounded-lg bg-white text-black py-2 font-medium hover:opacity-90 transition"
                        disabled={isConnecting}
                    >
                        {isConnecting ? <Loader2 className="text-[#131313] animate-spin mx-auto"/> : "Join Room"}
                    </button>
                </DialogFooter>
                </DialogContent>
            </DialogPortal>
            </Dialog>
        <div className="">
            <p className=" text-gray-500">Welcome, to the room <span className="italic">#{id}</span></p>
            <h1 className="text-medium font-semibold ">Organized by {organizer ? organizer.user.name : "Anonymous"}</h1>
        </div>
        <div className="w-full flex items-start">
            <div className="flex-1">
                Hey there
            </div>
            <div className="min-w-96 p-4 bg-[#131313] border-[#333]">
                <h1>Game Dashboard</h1>
                {
                    participants.length > 0 ? (
                        <div className="mt-4">
                            {participants.map((participant, i) => (
                                <div key={i} className="p-2 bg-[#121210]  rounded mb-2 flex items-center justify-between text-sm">
                                    <p className="text-sm tracking-wide text-white/50">
                                    {participant.user.name.slice(0, 14) + (participant.user.name.length > 14 ? "..." : "" )}
                                    </p>

                                    {0}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-4">No participants yet.</p>
                    )
                }
            </div>
        </div>
    </section>
  )
}

export default MultiplayerMode