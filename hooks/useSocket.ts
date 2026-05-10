import { useEffect, useState } from "react";
import { connectSocket, getSocket } from "@/lib/socket";

export const useSocket = () => {

    const [socket, setSocket] = useState<WebSocket | null>(
        getSocket()
    );

    useEffect(() => {

        const ws = connectSocket();

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

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