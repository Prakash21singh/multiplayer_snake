"use client"
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { useAuth } from '@/hooks/use-auth';
import { ExtendedWebSocket, GameStatus, UserStandByStatus } from '@/types';
import { convertSegmentPathToStaticExportFilename } from 'next/dist/shared/lib/segment-cache/segment-value-encoding';
type Props = {
    id: string
}

type Participants = {
    user: {
        id: string, 
        name: string
    }   
};

export interface Room {
    id: string;
    organizer: ExtendedWebSocket;
    participants: ExtendedWebSocket[];
    roomSize: number;
    gameStatus: GameStatus;
}

function getStatusColor(status: UserStandByStatus): string {
    switch(status) {
        case "waiting": return "text-yellow-500";
        case "ready": return "text-green-500";
        case "playing": return "text-blue-500";
        default: return "text-gray-500";
    }
}

function getStatusText(status: UserStandByStatus): string {
    switch(status) {
        case "waiting": return "Waiting";
        case "ready": return "Ready";
        case "playing": return "Playing";
        default: return "Unknown";
    }
}

function getStatusEmoji(status: UserStandByStatus): string {
    switch(status) {
        case "waiting": return "🥱";
        case "ready": return "✅";
        case "playing": return "🎮";
        default: return "❓";
    }
}

function getGameStatus(status: GameStatus): string {
    switch(status) {
        case "waiting": return "Waiting for players to be ready";
        case "in-progress": return "Game in progress";
        case "finished": return "Game finished";
        default: return "Unknown status";
    }
}

function MultiplayerMode({
    id
}: Props) {
    const {socket, sendMessage} = useSocketContext();
    const {user} = useAuth()
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState<ExtendedWebSocket[]>([]);
    const [room, setRoom] = useState<Room | null>(null)
    const [gameStatus, setGameStatus] = useState<"waiting" | "in-progress" | "finished" | null>(null);
    

    const handleJoinRoom = useCallback(() => {
        if(!socket || !user) return;
        
        sendMessage(JSON.stringify({
            type: "JOIN_ROOM",
            payload: {  
                roomId: id,
            }
        }));

    }, [socket, user]);

    useEffect(() => {
        if (!user || !socket) return;

        const checkRoom = () => {
            socket.send(JSON.stringify({
                type: "ROOM_AVAILABILITY_CHECK",
                payload: {
                    roomId: id
                }
            }));
        };

        if (socket.readyState === WebSocket.OPEN) {
            checkRoom();
        } else {
            socket.addEventListener("open", checkRoom);
        }

        return () => {
            socket.removeEventListener("open", checkRoom);
        };

    }, [socket, id, user]);

    const changeStandByMethodToReady = useCallback(()=>{

        if(!socket) return;

        if(socket.readyState !== WebSocket.OPEN) return;

        sendMessage(JSON.stringify({
            type: "CHANGE_STANDBY_STATUS",
            payload: {
                roomId: id,
                standByStatus: "ready"
            }
        }));

    },[socket]);

    const changeStandByMethodToWaiting = useCallback(()=>{

        if(!socket) return;
        if(socket.readyState !== WebSocket.OPEN) return;

        sendMessage(JSON.stringify({
            type: "CHANGE_STANDBY_STATUS",
            payload: {
                roomId: id,
                standByStatus: "waiting"
            }
        }));

    },[socket]);


    // TODO: Listen for incoming event
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (ev: MessageEvent) => {
            const message = JSON.parse(ev.data);
            console.log({message})

            switch (message.type) {
                case "ROOM_AVAILABILITY":
                    setLoading(false);
                    setRoom(message.payload.room);
                    setParticipants(message.payload.room?.participants || []);
                    handleJoinRoom()
                    break;
                case "JOINED_ROOM":
                    setParticipants(message.payload.participants);
                    break;
                case "PARTICIPANT_JOINED":
                    setParticipants((prev) => [...prev, message.payload.participant]);
                    break;
                case "PARTICIPANT_LEFT":
                    setParticipants((prev) => prev.filter(p => p.user.id !== message.payload.participant.user.id));
                    break;
                case "GAME_STARTED":
                    setGameStatus("in-progress");
                    break;
                case "STANDBY_STATUS_UPDATED":
                    if(!user) return;
                    setParticipants((prev) => prev.map(p => {
                        if(p.user.id === user.id){
                            return {
                                ...p,
                                standByStatus: message.payload.standByStatus
                            }
                        }
                        return p;
                    }))
                    break;

                case "STANDBY_STATUS_CHANGED":
                    setParticipants((prev) => prev.map(p => {
                        if(p.user.id === message.payload.userId){
                            return {
                                ...p,
                                standByStatus: message.payload.standByStatus
                            }
                        }
                        return p;
                    }))
                    break;

                default:
                    break;
            }
        };

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket]);


    if(loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#333]"/>
            </div>
        )
    }

    if(!room) {
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
        <>
            <section className="w-full max-w-6xl mx-auto p-4">
                <div className="">
                    <p className=" text-gray-500">Welcome, to the room <span className="italic">#{id}</span></p>
                    <h1 className="text-medium font-semibold ">Organized by {room.organizer.user.name || "Anonymous"}</h1>
                </div>

                    <div className="w-full flex items-start gap-4 my-8">
                        <div className="flex-1">
                            Game Area
                        </div>
                        <div className="min-w-96 p-6 bg-[#131313] ">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-white">Participants</h2>
                                <span className="text-sm text-gray-500">{participants.length} player{participants.length !== 1 ? "s" : ""}</span>
                            </div>

                            {
                                participants.length > 0 ? (
                                    <div className="space-y-3">
                                        {participants.map((participant, i) => {
                                            const isCurrentUser = user && participant.user.id === user.id;
                                            const isOrganizer = room.organizer.user.id === participant.user.id;
                                            return (
                                                <div key={i} className="p-3 bg-[#0a0a0a] border border-[#222] rounded-lg hover:border-[#333] transition-colors">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2 flex-1">
                                                            <div>
                                                                <p className="text-sm font-medium text-white">
                                                                    {participant.user.name.slice(0, 16) + (participant.user.name.length > 16 ? "..." : "")}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {isCurrentUser && <span className="text-amber-500">You</span>}
                                                                    {isOrganizer && <span className="text-purple-500"> • Organizer</span>}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className="text-2xl">{getStatusEmoji(participant.standByStatus)}</span>
                                                            <span className={`text-xs font-semibold ${getStatusColor(participant.standByStatus)}`}>
                                                                {getStatusText(participant.standByStatus)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {isCurrentUser && participant.standByStatus !== "playing" && (
                                                        <div className="flex gap-2 pt-3 border-t border-[#222]">
                                                            <button
                                                                onClick={changeStandByMethodToWaiting}
                                                                className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${
                                                                    participant.standByStatus === "waiting"
                                                                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                                                                        : "bg-[#222] text-gray-300 hover:bg-[#333] hover:text-white"
                                                                }`}
                                                            >
                                                                Wait
                                                            </button>
                                                            <button
                                                                onClick={changeStandByMethodToReady}
                                                                className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${
                                                                    participant.standByStatus === "ready"
                                                                        ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                                                        : "bg-[#222] text-gray-300 hover:bg-[#333] hover:text-white"
                                                                }`}
                                                            >
                                                                Ready
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <p className="text-gray-500 text-sm">Waiting for participants...</p>
                                    </div>
                                )
                            }
                            
                            <p className="text-center text-sm text-white/40 mt-3">{getGameStatus(room.gameStatus)}</p>
                        </div>
                    </div>
            </section>
        </>
    )
}

export default MultiplayerMode;
