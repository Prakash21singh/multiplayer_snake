import { use, useEffect, useState } from "react";
import { connectSocket, getSocket } from "@/lib/socket";
import { useAuth } from "./use-auth";

export const useSocket = () => {

    const {user, session} = useAuth()

    const [socket, setSocket] = useState<WebSocket | null>(
        getSocket()
    );

    useEffect(() => {
        if(!user) return;
        const ws = connectSocket(user.id, user.name);

        setSocket(ws);
    }, [user]);

    const sendMessage = (message: string) => {

        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(message);
        }

    };

    return {
        socket,
        sendMessage
    };
};