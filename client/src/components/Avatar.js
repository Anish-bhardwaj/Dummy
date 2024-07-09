import React from 'react'
import { LuUserCircle2 } from "react-icons/lu";
import { useSelector } from 'react-redux';
const Avatar = ({userId,name,imageUrl,width,height}) => {
    let avatarName="";
    const onlineUser=useSelector(state=>state?.user?.onlineUser)
    if(name){
        const splitName=name?.split(" ");
        if(splitName.length>1){
            avatarName=splitName[0][0]+splitName[1][0];
        }else{
            avatarName=splitName[0][0];
        }
    }
    const isOnline=onlineUser.includes(userId);
    const bgColor=[
        "bg-slate-200",
        "bg-teal-200",
        "bg-red-200",
        "bg-green-200",
        "bg-yellow-200",
        "bg-sky-400",
        "bg-zinc-300",
        "bg-indigo-300	",
        "bg-rose-400	",
        "bg-fuchsia-400	"
        
    ]
    const rand=Math.floor(Math.random()*10);
  return (
    <div  style={{width : width+"px", height : height+"px" }} className= {` text-slate-800  rounded-full text-xl font-bold shadow border flex items-center justify-center relative`}>
        {
            imageUrl ?(
                <img className={` overflow-hidden rounded-full object-cover `} src={imageUrl} style={{width : width+"px", height : height+"px" }} alt='User image'/>
            ):
            (
                name?(
                    <div style={{width : width+"px", height : height+"px" }} className={` overflow-hidden rounded-full  flex justify-center items-center text-xl  ${bgColor[rand]}`}>
                        {avatarName}

                    </div>):(
                        <LuUserCircle2 size={width}  className=''/>
                    )
            )
        }

        {
            isOnline &&(
                <div className=' p-1 absolute rounded-full bg-green-600 bottom-1 right-0'></div>
            )
        }
    </div>
  )
}

export default Avatar
