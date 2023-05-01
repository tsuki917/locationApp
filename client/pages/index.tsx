import Image from 'next/image'
import { Inter } from 'next/font/google'
import io from "socket.io-client";
import { SocketAddress } from 'net';
import Map from "../component/Map"


const socket = io("http://localhost:5000");
const inter = Inter({ subsets: ['latin'] })

socket.on('connection',()=>{
  console.log("connection");
})
export default function Home() {
  return (
     <div>
      <div id='map'></div>
     <Map lat={0} lng={0}/>
     </div>

     
  );
}
