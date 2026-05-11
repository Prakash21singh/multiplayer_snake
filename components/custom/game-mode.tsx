"use client"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { IconCaretDownFilled, IconCaretLeftFilled, IconCaretRightFilled, IconCaretUpFilled, IconRefresh } from "@tabler/icons-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useSocketContext } from "@/contexts/socket-context";

function CardFooterContent() {
    return (
        <CardFooter>
            <div className="w-full flex items-center justify-between gap-8">
                
                {/* Left Content */}
                <div className="max-w-sm">
                    <h2 className="uppercase tracking-[0.2em] text-xs text-white/40 mb-3">
                        Controls
                    </h2>

                    <p className="text-white/60 leading-relaxed text-sm">
                        Use your keyboard arrow keys to control the snake movement
                        inside the game grid. Avoid hitting the walls or yourself.
                    </p>
                </div>

                {/* Joystick Layout */}
                <div className="relative w-72 h-30 flex items-center justify-center">
                    
                    {/* Up */}
                    <div className="absolute top-0 group">
                        <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-200 hover:bg-white hover:text-black hover:scale-110">
                            <IconCaretUpFilled size={20} />
                        </button>

                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                            <div className="px-3 py-1 rounded-lg bg-black border border-white/10 text-xs text-white whitespace-nowrap">
                                Move Up
                            </div>
                        </div>
                    </div>

                    {/* Left */}
                    <div className="absolute left-0 group">
                        <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-200 hover:bg-white hover:text-black hover:scale-110">
                            <IconCaretLeftFilled size={20} />
                        </button>

                        <div className="absolute top-1/2 -translate-y-1/2 -left-24 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                            <div className="px-3 py-1 rounded-lg bg-black border border-white/10 text-xs text-white whitespace-nowrap">
                                Move Left
                            </div>
                        </div>
                    </div>

                    {/* Center Dot */}
                    <div className="w-5 h-5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md" />

                    {/* Right */}
                    <div className="absolute right-0 group">
                        <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-200 hover:bg-white hover:text-black hover:scale-110">
                            <IconCaretRightFilled size={20} />
                        </button>

                        <div className="absolute top-1/2 -translate-y-1/2 -right-24 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                            <div className="px-3 py-1 rounded-lg bg-black border border-white/10 text-xs text-white whitespace-nowrap">
                                Move Right
                            </div>
                        </div>
                    </div>

                    {/* Down */}
                    <div className="absolute bottom-0 group">
                        <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-200 hover:bg-white hover:text-black hover:scale-110">
                            <IconCaretDownFilled size={20} />
                        </button>

                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                            <div className="px-3 py-1 rounded-lg bg-black border border-white/10 text-xs text-white whitespace-nowrap">
                                Move Down
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CardFooter>
    )
}
export default function GameMode(){

    const [roomId, setRoomId] = useState("");
    const [selectedTab, setSelectedTab] = useState("free");
    const {get, set} = useLocalStorage()
    const { sendMessage, socket } = useSocketContext();
    const {id, name, setName} = useUser()
   
    const router = useRouter();

    const generateRandomRoomId = useCallback(() => {
        console.log("Generating random room ID...");
        const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomId(randomId);
    }, []);

    useEffect(()=>{
        generateRandomRoomId();
    }, [generateRandomRoomId]);

    useLayoutEffect(()=>{
        const selectedTab = get("home:selected_tab") || "free";
        setSelectedTab(selectedTab);
    },[])

    async function createRoom(roomId: string) {
        try {
            sendMessage(JSON.stringify({
                type: "CREATE_ROOM",
                payload: {
                    roomId: roomId,
                    organizer: {
                        user: {
                            id,
                            name
                        }
                    }
                }
            }));
        } catch (error) {
            console.error("Error creating room:", error);
        }
    }

    useEffect(()=>{
        if (!socket) return;
        const handleMessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data);
                switch (message.type) { 
                    case "ROOM_CREATED":
                        router.push(`/game/${message.payload.roomId}`);
                        break;
                    case "ERROR":
                        alert(`Error: ${message.payload.message}`);
                        break;
                    // Add more cases as needed
                    default:
                        console.warn("Unknown message type:", message.type);
                }
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };

        socket.addEventListener("message", handleMessage);
        return () => {
            socket.removeEventListener("message", handleMessage);
        }
    }, [socket]);

        

    return (
        <div className="  p-8">
            <Tabs defaultValue={"free"} value={selectedTab} className={"w-lg flex flex-col"} onValueChange={(value)=>{
                // console.log(value)
                setSelectedTab(value);
                set("home:selected_tab", value);
            }}>
            <TabsList>
                <TabsTrigger value={"free"}>Free game</TabsTrigger>
                <TabsTrigger value={"multiplayer"}>Multiplayer</TabsTrigger>
            </TabsList>
            <TabsContent value={"free"}>
                <Card className="bg-[#131313] border border-[#333] relative">
                     <div
                        style={{
                        height: 1,
                        background: `linear-gradient(40deg, transparent, #b69121, transparent)`,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 0,
                        }}
                    />
                    <CardHeader>
                        <CardTitle className="text-white">Free game</CardTitle>
                        <CardDescription className="text-white/40">Play free game unlimited times</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <p className="text-white">Welcome to the free game mode!</p>
                            <p className="mt-2 text-white/60">In this mode, you can play the snake game without any time limits or restrictions. Enjoy the classic gameplay and try to beat your high score!</p>    
                            <button className="float-right px-6 py-3 rounded-xl mt-2 border border-[#333] bg-[#1a1a1a] hover:bg-[#333] text-white transition-colors duration-200 cursor-pointer">
                                Start Game
                            </button>
                        </div>
                    </CardContent>
                    <CardFooterContent/>
                </Card>
            </TabsContent>

            <TabsContent value={"multiplayer"}>
                <Card className="bg-[#131313] border border-[#333] relative">
                    <div
                        style={{
                        height: 1,
                        background: `linear-gradient(40deg, transparent, #00d084, transparent)`,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 0,
                        }}
                    />
                    <CardHeader>
                        <CardTitle className="text-white">Multiplayer</CardTitle>
                        <CardDescription className="text-white/40">Play with your friends in real-time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <p className="text-white">Welcome to the multiplayer mode!</p>
                            <p className="mt-2 text-white/60">In this mode, you can play the snake game with your friends in real-time. Compete against each other to see who can get the highest score!</p>    
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name || ""}
                                onChange={(e) => setName(e.target.value)}
                                className="flex-1 w-full rounded-lg mt-4 bg-transparent text-mauve-500 px-2 py-2  placeholder-white/30 border border-[#333]   focus:outline-none"
                            />
                            <div className="mt-4 flex items-center gap-2">
                                <div className="flex flex-1 items-center rounded-lg border border-[#333] bg-[#000] px-2">

                                    <input
                                        type="text"
                                        placeholder="Refresh to autogenerate new room id"
                                        value={roomId}
                                        onChange={(e) => setRoomId(e.target.value)}
                                        className="flex-1 bg-transparent text-mauve-500 px-2 py-2  placeholder-white/30 focus:outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={()=>generateRandomRoomId()}
                                        className="cursor-pointer text-white/70 transition hover:text-white"
                                    >
                                        <IconRefresh width={20} />
                                    </button>
                                    </div>
                                <button
                                    onClick={()=>createRoom(roomId)}
                                    className="px-6 py-2 rounded-lg border border-[#333] bg-[#1a1a1a] hover:bg-[#333] text-white transition-colors duration-200 cursor-pointer">
                                    Join Room
                                </button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooterContent/>
                </Card>
            </TabsContent>
            </Tabs>
        </div>
    )
}