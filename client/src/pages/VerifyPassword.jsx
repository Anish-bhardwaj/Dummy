import React, { useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LuUserCircle2 } from "react-icons/lu";
import axios from 'axios'
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';


const VerifyPassword = () => {
  const [data,setData]=useState({
    password: "",
})
const navigate=useNavigate();
const location=useLocation();
const dispatch =useDispatch();
const changeHandler=(e)=>{
  const {name,value}=e.target;
  setData({...data,[name]:value})
}

useEffect(()=>{
  if(!location?.state?.name){
    navigate('/email');
  }
},[])
const  submitHandler=async (e)=>{
  e.preventDefault();
  e.stopPropagation();
  const url=`${process.env.REACT_APP_BACKEND_URL}/api/v1/password`;
  try{
    
    const response =await axios({
      method: "post",
      url:url,
      data:{
      password:data.password,
      userId:location?.state?._id
    },
    withCredentials:true
  });
    toast.success(response?.data?.message);
    if(response.data.success){

      dispatch(setToken(response?.data?.token));
      localStorage.setItem('token',response?.data?.token);


      setData({
        password: "",
      });
      navigate('/');
    }
    
  }catch(err){
    toast.error(err?.response?.data?.message);
    
  }
  
}
return (
  <div className=' mt-5  flex justify-center'>
    <div className=' bg-white max-w-sm w-full mx-2 rounded p-4 overflow-hidden '>
      <div className='w-fit mx-auto mb-2 flex flex-col  justify-center items-center'>
      <Avatar width={70} name={location?.state?.name} imageUrl={location?.state?.profilePic} height={70}/>
      <h2 className='font-semibold text-lg mt-2'>{location?.state?.name}</h2>
      </div>
      
      <form className='grid gap-4 mt-5' onSubmit={submitHandler}>
        

      <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password :</label>
            <input 
            type='password' 
            id='password' 
            name='password' 
            value={data.password}
            onChange={changeHandler}
            required
            placeholder='Enter your password' className=' bg-slate-100 px-2 py-1 rounded focus:outline-primary '/>
          </div>


        <button 
          
          
          className=' font-bold text-white mt-2 px-4 text-lg py-2 rounded bg-primary hover:bg-secondry transition'>Login</button>
      </form>

      <p className='my-2 text-center'> <Link to={"/forgot-password"} className=' font-semibold hover:text-primary '>Forgot password ?</Link></p>
    </div>
  </div>
)
}



export default VerifyPassword
