import io from "socket.io-client";
import { BASE_URL } from '../constants/Constants';

let socketInstance = null;

export const createSocketConnection = () => {
    if (!socketInstance) {
        socketInstance = io(BASE_URL, {
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