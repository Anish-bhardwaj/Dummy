import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setOnlineUser, setUser, setsocketConnection } from '../redux/userSlice'
import SideBar from '../components/SideBar'
import { useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import io from 'socket.io-client';
const Home = () => {
  const user=useSelector(state=>state.user);
  console.log("User",user);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const location=useLocation();
  const fetchUserDetails=async()=>{
   
    const url=`${process.env.REACT_APP_BACKEND_URL}/api/v1/userDetails`;

    try{
      const response= await axios({
        url:url,
        withCredentials:true
        
      })
      dispatch(setUser(response?.data?.data));
      
      if(response.data.data.logout){
        dispatch(logout());
        navigate('/email');
      }
    }catch(err){
      console.log(err);
    }
  }
  useEffect(()=>{
    
    fetchUserDetails()
  },[]);
  // Socket connection

  useEffect(()=>{
    const socketConnection=io(process.env.REACT_APP_BACKEND_URL,{
      auth:{
        token:localStorage.getItem('token')
      }
    })
    socketConnection.on('connect', () => {
      console.log('Connected to socket server:', socketConnection.id);
    });
    socketConnection.on('onlineUser',(data)=>{
      console.log(data);
      dispatch(setOnlineUser(data));
    })
    dispatch(setsocketConnection(socketConnection));
    return ()=>  {  socketConnection.disconnect();}
  },[]);
  
  const basePath=location.pathname === "/"
  return (
    <div className=' grid lg:grid-cols-[1fr,3fr] h-screen max-h-screen '>
      <section className={ `bg-white ${!basePath && "hidden"} lg:block `}>
        <SideBar/>

      </section>
      {/* Message component */}
        <section className={`${basePath && "hidden"}`}>
            <Outlet/>
        </section>

        <div className={` flex-col  items-center justify-center gap-2  hidden ${!basePath ?"hidden":"lg:flex"}`}>
          <div>
              <img src={logo} width={300} alt='logo'/>
          </div>
          <p className='text-lg mt-2 text-slate-500 select-none'>Select User to Send Message</p>
        </div>
    </div>
  )
}

export default Home
