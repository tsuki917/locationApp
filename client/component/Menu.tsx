import { v4 as uuidv4 } from "uuid"
import { NextRouter,Router,useRouter } from "next/router";

const createNewArticle = (router: NextRouter) => {
  console.log("車いすでも参加できるものを平が探してくれたのです。")
  router.push({
    pathname: '../room/[uuid].tsx',
    query: { uuid: uuidv4() },
  });
};

export default function Menu(){
  const router = useRouter();
    

    return (
        <div className="Home">
          <div id="title" className=' pl-2 items-center bg-green-300 border w-full h-[80px] text-5xl font-mono font-bold flex'>LocationApp</div>
            <button onClick={()=>createNewArticle(router)} className="inline-block  bg-gradient-to-br from-blue-300 to-blue-800 hover:bg-gradient-to-tl text-white rounded px-4 py-2 my-2 m-auto">部屋を形成</button>
        </div>
    )
}