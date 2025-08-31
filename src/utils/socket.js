import io from "socket.io-client"
const VITE_BASE_URL=import.meta.env.VITE_BASE_URL;
export const   createSocketConnection=()=>{
    return io(VITE_BASE_URL)

}