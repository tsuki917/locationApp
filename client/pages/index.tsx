import { Inter } from 'next/font/google'
import Map from "../component/Map"



const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  return (
    <div>
      <div id="title" className=' pl-2 items-center bg-green-300 border w-full h-[80px] text-5xl font-mono font-bold flex'>LocationApp</div>
      <div id='map' className='w-[375px] '>
        <Map />
      </div>
    </div>


  );
}
