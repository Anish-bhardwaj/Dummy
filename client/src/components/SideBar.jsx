import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { TbLogout2 } from "react-icons/tb";
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUser from './EditUser';
import Divider from './Divider';
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FiArrowUpLeft } from "react-icons/fi";
import SearchBar from './SearchBar';
import { logout } from '../redux/userSlice';


const SideBar = () => {


    const user=useSelector(state=>state?.user);
    const [editUser,setEditUser]=useState(false);
    const[allUser,setAllUser]=useState([]);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const[openSearchBar,setSearchBar]=useState(false);
    


    

    const handleLogout=()=>{
        dispatch(logout);
        localStorage.clear();
        navigate('/email')
    }
    const socketConnection=useSelector(state=>state?.user?.socketConnection);
    useEffect(()=>{
        if(socketConnection){
            socketConnection.emit('sidebar',user?._id)

            socketConnection.on('conversation',(data)=>{
                console.log("CONVERSATION",data);
                const conversationUserData=data.map((conversationUser,index)=>{
                    if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
                        return{
                            ...conversationUser,
                                userDetails:conversationUser?.sender
                        }
                    }
                    else if(conversationUser?.receiver?._id !== user?._id){
                        return{
                            ...conversationUser,
                                userDetails:conversationUser?.receiver
                        }
                    }else{
                        return{
                            ...conversationUser,
                                userDetails:conversationUser?.sender
                        }
                    }
                })
                setAllUser(conversationUserData);
            });
        }
    },[socketConnection,user])
  return (
    <div className='w-full h-full grid  grid-cols-[48px,1fr] bg-white'>
        <div className=' bg-slate-100  h-full w-12 rounded-tr-lg rounded-br-lg py-4 text-slate-600 flex flex-col justify-between'>
            <div>
                <NavLink title='chat' className={ ({isActive})=>`flex cursor-pointer rounded  hover:bg-slate-200  items-center justify-center w-12 h-12 ${isActive && "bg-slate-200"}`}>
                <IoChatbubbleEllipses size={25}/>
                </NavLink>
                <div title='add friend' onClick={()=>setSearchBar(true)} className='flex cursor-pointer rounded  hover:bg-slate-200  items-center justify-center w-12 h-12'>
                <FaUserPlus size={25}/>
                </div>
            </div>
            <div className=' justify-center items-center flex flex-col'>
                <button title={user?.name}  onClick={()=>{setEditUser(true)}} className=' rounded-full' >
                    <Avatar width={40}  height={40} name={user?.name} imageUrl={user?.profilePic} userId={user?._id} />

                </button>
            <button title='logout' onClick={handleLogout} className='flex cursor-pointer rounded  hover:bg-slate-200  items-center justify-center w-12 h-12'>
                <TbLogout2 size={25}/>
                </button>
            </div>
        </div>
        <div className=' w-full '>
            <h2 className='text-xl  text-center font-bold p-4 text-slate-800 h-16 '>Message</h2>
            
            <div className=' bg-slate-200 p-[0.5px]'></div>
            <div className=' h-[calc(100vh-65px)]  overflow-x-hidden overflow-y-auto  scrollbar'>
                {
                    allUser.length===0&&(
                        <div className=' mt-12' >
                            <div className=' flex justify-center items-center text-slate-500  my-4'><FiArrowUpLeft size={50}/></div>
                            <p className=' text-lg text-center text-slate-400 select-none'>Explore Users to start a conversation with.</p>
                        </div>
                    )
                }
                {
                    allUser.map((conv,index)=>{

                        
                        return (
                            <NavLink to={"/"+conv?.userDetails?._id} key={ conv?._id} className=' flex items-center gap-2 px-2 py-3 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer '>
                                    <div>
                                        <Avatar 
                                        imageUrl={conv?.userDetails?.profilePic} 
                                        name={conv?.userDetails?.name}
                                        width={40}
                                        height={40}
                                        />
                                    </div>
                                    <div>
                                        <h3 className=' text-ellipsis line-clamp-1 font-semibold text-base '>{conv?.userDetails?.name}</h3>
                                        <div className=' text-slate-500 text-xs flex items-center gap-2'>
                                            <div className=' flex items-center gap-2'>
                                                {
                                                    conv?.lastMsg?.imageUrl &&(
                                                        <span className=' flex items-center gap-2'>
                                                       <span className=' '> <FaImage/></span>
                                                        { !conv?.lastMsg?.text && <span>Image</span>}
                                                       
                                                        </span>
                                                    )
                                                }
                                                 {
                                                    conv?.lastMsg?.videoUrl &&(
                                                        <span className=' flex items-center gap-2'>
                                                       <span className=' '> <FaVideo/></span>
                                                       {!conv?.lastMsg?.text && <span>Video</span>}
                                                       </span>
                                                    )
                                                }
                                            </div>
                                            <p className=' text-ellipsis line-clamp-1 '> {conv?.lastMsg?.text}</p>
                                        </div>
                                    </div>
                                    {conv?.unseenMsg!==0 &&(

                                        <p className='  ml-auto p-1 bg-primary text-xs w-6 h-6 flex items-center justify-center  text-white font-semibold rounded-full '>
                                            { conv?.unseenMsg}
                                        </p>
                                    )
                                }
                            </NavLink>
                        )
                    })
                }
            </div>
        </div>
        {/* Edit user details */}
        {
            editUser&&(
                <EditUser onClose={()=>setEditUser(false)} user={user}/>
            )
        }

        {/* Search bar */}
        {
            openSearchBar&&(
                <SearchBar onClose={()=>{
                    setSearchBar(false)
                }}/>
            )
        }
    </div>
  )
}

export default SideBar
