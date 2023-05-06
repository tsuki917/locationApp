import { Inter } from 'next/font/google'
import Map from "../component/Map"



const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  return (
     <div>
      <div id='map'></div>
     <Map lat={0} lng={0}/>
     </div>

     
  );
}
