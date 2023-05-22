import { Inter } from 'next/font/google'
import Map from "../component/Map"



const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  return (
    <div>
      <div id='map' className='w-[375px] '>
        <Map />
      </div>
    </div>


  );
}
