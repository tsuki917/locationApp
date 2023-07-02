import { Inter } from 'next/font/google'
import Map from "../component/Map"
import Menu from '@/component/Menu';


const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  return (
    <div className='text-center'>
      
      <Menu/>
      
    </div>


  );
}
