import React, { useEffect,useRef,useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar';
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from "react-icons/io5";
import Spinner from './Spinner';
import wallpaper from '../assets/wallapaper.jpeg'
import { IoMdSend } from "react-icons/io";
import moment from 'moment'




const MessagePage = () => {
  const params=useParams();
  const [imageVideo,setImageVideo]=useState(false);
  const [allMessage,setAllMessage]=useState([]);
  const user=useSelector((state)=>state?.user);
  const socketConnection=useSelector(state=>state?.user?.socketConnection);
  const[loading,setLoading]=useState(false);
  const [userdata,setUserData]=useState({
    _id:"",
    name:"",
    email:"",
    online:false,
    profilePic:""
  })
  const currentMessage=useRef();
  const [message,setMessage]=useState({
    text:"",
    imageUrl:"",
    videoUrl:""
  });

  useEffect(()=>{
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({ behaviour:'smooth',block:'end'})
    }
  })
  useEffect(()=>{
    if(socketConnection){
      socketConnection.emit('message-page',params?.userId)
      socketConnection.emit('seen',params?.userId)
      socketConnection.on('message-page',(data)=>{
        
        setUserData(data)
      })
      socketConnection.on('message',(data)=>{
        console.log("Message Data",data);
        setAllMessage(data);
      })

    }
  },[socketConnection,params?.userId,user])

  const handleFilesButton=()=>{
      setImageVideo(!imageVideo)
  }
  const changeHandler= (e)=>{
    const{ name,value}=e.target;
    setMessage(preve=>{
      return{
        ...preve,
        text: value
      }
    })
    
    
  }
  const submitHandler=async (e)=>{
    e.preventDefault();
    if(message?.text||message?.imageUrl||message?.videoUrl){
      if(socketConnection){
        socketConnection.emit('new message',{
        sender: user?._id,
        receiver: params?.userId,
        text:message?.text,
        imageUrl:message?.imageUrl,
        videoUrl:message?.videoUrl,
        msgByUserId:user?._id
      
      })
      setMessage({
        text:"",
        imageUrl:"",
        videoUrl:""
      });
    }
    }
  }
  const handleUploadImage=async (e)=>{
    setLoading(true);
    const file=e.target.files[0];
    try{

      const uploadPhoto = await uploadFile(file)
      setMessage(preve=>{
        return{
          ...preve,
          imageUrl:uploadPhoto?.url
        }
      })
      
    }catch(err){
      console.log(err);
    }
    setLoading(false);
    setImageVideo(false);
  }
  const handleClearUploadImage=()=>{
    setMessage(preve=>{
      return{
        ...preve,
        imageUrl:""
      }
    })
  }
  const handleClearUploadVideo=()=>{
    setMessage(preve=>{
      return{
        ...preve,
        videoUrl:""
      }
    })
  }
  const handleUploadVideo=async (e)=>{
    setLoading(true);
    const file=e.target.files[0];
    try{

      const uploadVideo = await uploadFile(file)
      setMessage(preve=>{
        return{
          ...preve,
          videoUrl:uploadVideo?.url
        }
      })
      
    }catch(err){
      console.log(err);
    }
    setLoading(false);
    setImageVideo(false);
  }
  return (
    <div style={{backgroundImage:`url(${wallpaper})`}} className=' bg-no-repeat bg-cover'>
      <header className=' sticky top-0 h-16 bg-white  flex justify-between items-center px-4'>
          <div className=' flex items-center gap-3'>
            <Link to={'/'} className=' lg:hidden'>
                <IoIosArrowBack size={25}/>
            </Link>
            <div className=' flex items-center'>
              <Avatar
              width={50}
              height={50}
              name={userdata?.name}
              imageUrl={userdata?.profilePic}
              userId={userdata?._id}
              />
            </div>
            <div className=' items-center'>
              <h3 className=' text-lg text-ellipsis line-clamp-1  font-semibold my-0'>
                {userdata?.name}
              </h3>
              <p className=' text-sm  -my-2'> 
                {userdata?.online?<span className=' text-primary'>Online</span>:<span className=' text-slate-400'>Offline</span>}

              </p>
            </div>
          </div>
          <div>
            <button className=' cursor-pointer hover:text-primary'>
            <BsThreeDotsVertical/>
            </button>
          </div>
      </header>
      {/* Messages section */}
      <section className=' h-[calc(100vh-128px)]  scrollbar overflow-x-hidden overflow-y-auto bg-slate-200 bg-opacity-50 relative'>
        
        {/* Displaying all messages */}
        <div ref={currentMessage} className=' flex flex-col gap-2 py-2 mx-2'>
        {
          allMessage.map((msg,index)=>{
            return (
              <div  className={` max-w-[200px] md:max-w-sm lg:max-w-md p-1 py-1 rounded w-fit ${user._id === msg?.msgByUserId?" ml-auto bg-teal-100"  :"bg-white mr-auto"}  `}>
               <div className=' w-full '>

                {msg?.imageUrl&&(
                  
                    <img src={msg?.imageUrl}  className=' aspect-square w-full h-full object-scale-down'/>
                  
                )}

                {msg?.videoUrl&&(
                  
                    <video src={msg?.videoUrl} controls autoPlay className=' aspect-square w-full h-full object-scale-down'/>
                  
                )}
               </div>
               
                <p className=' px-2'>{msg?.text}</p>
                <p className=' text-xs ml-auto w-fit'>{moment(msg?.createdAt).format('hh:mm')}</p>
              </div>
            )
          })
        }
        </div>
        
        
        {/* upload image display */}
        {
          message?.imageUrl&&(
            <div className=' w-full sticky bottom-0  h-full bg-slate-700 bg-opacity-30  flex justify-center items-center rounded overflow-hidden ' >
              <div className=' w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadImage}>
                  <IoClose className='' size={30}/>
              </div>
            <div className=' bg-white   p-3'>
              <img
              src={message.imageUrl}
              className=' aspect-square object-scale-down w-full h-full max-w-sm m-2'
              alt='uploadImage'
              />

            </div>
        </div>
          )
        }

        {/* upload video display */}
        {
          message?.videoUrl&&(
            <div className=' w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30  flex justify-center items-center rounded overflow-hidden ' >
              <div className=' w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
                  <IoClose className='' size={30}/>
              </div>
            <div className=' bg-white   p-3'>
              <video
              src={message.videoUrl}
              width={300}
              height={300}
              controls
              muted autoPlay
              className=' aspect-square object-scale-down w-full h-full max-w-sm m-2'
              />

            </div>
        </div>
          )
        }

        {/* Loading stage */}
        {
          loading&&(
            <div className=' w-full h-full sticky bottom-0 flex justify-center items-center'>
            <Spinner/>
            </div>
          )
        }

      </section>

      {/* Sending Message Section*/}
      <section className=' h-16 bg-white flex items-center px-4'>
          <div className=' relative '>
            <button 
            onClick={handleFilesButton}
            className='justify-center items-center flex  w-11 h-11 rounded-full hover:text-white hover:bg-primary'>
              <FaPlus size={20}/>
            </button>
            {/* File Upload Section */}
            {
              imageVideo &&(
                <div className=' absolute bottom-14 w-36 p-2 bg-white shadow rounded'>
              <form>
                <label htmlFor='uploadImage' className=' flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer rounded-sm'>
                  <div>
                    <FaImage className=' text-primary' size={18}/>
                  </div>
                  <p>Image</p>
                </label>
                <label htmlFor='uploadVideo' className= ' cursor-pointer rounded-sm hover:bg-slate-200 flex items-center p-2 gap-3'>
                  <div>
                    <FaVideo size={18} className=' text-purple-500'/>
                  </div>
                  <p>Video</p>
                </label>
                <input
                type='file'
                id='uploadImage'
                className=' hidden'
                onChange={handleUploadImage}
                />
                <input
                type='file'
                id='uploadVideo'
                className='hidden'
                onChange={handleUploadVideo}
                />
              </form>
            </div>    
              )
            }
            
          </div>
          {/* Input box */}
          <form className=' h-full w-full flex gap-2  items-center' onSubmit={submitHandler}>
            
                <input type='text' placeholder='Type a message...' 
                className=' py-1 px-4 w-full h-full outline-none'
                value={message?.text}
                onChange={changeHandler}
                />
                <button className=' text-primary hover:text-secondry'>
                    <IoMdSend size={25}/>
                </button>
          </form>
      </section>
    </div>
  )
}

export default MessagePage
