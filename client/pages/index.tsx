import Image from 'next/image'
import { Inter } from 'next/font/google'
import io from "socket.io-client";
import { SocketAddress } from 'net';


const socket = io("http://localhost:5000");
const inter = Inter({ subsets: ['latin'] })

socket.on('connection',()=>{
  console.log("connection");
})
export default function Home() {
  return (
     <div>
      test
     </div>
  );
}
