let socket: WebSocket | null = null;

export const connectSocket = () => {

    if (
        socket &&
        (
            socket.readyState === WebSocket.OPEN ||
            socket.readyState === WebSocket.CONNECTING
        )
    ) {
        return socket;
    }

    socket = new WebSocket(
        `ws://localhost:8080/ws?id=23xlkr&name=John`
    );

    socket.onopen = () => {
        console.log("connected");
    };

    socket.onclose = () => {
        console.log("disconnected");
    };

    socket.onerror = (err) => {
        console.log(err);
    };

    return socket;
};

export const getSocket = () => socket;