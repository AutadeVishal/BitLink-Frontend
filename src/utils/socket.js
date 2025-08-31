import io from "socket.io-client";
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

let socketInstance = null;

export const createSocketConnection = () => {
    if (!socketInstance) {
        socketInstance = io(VITE_BASE_URL, {
            withCredentials: true
        });
    }
    return socketInstance;
};

export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
};