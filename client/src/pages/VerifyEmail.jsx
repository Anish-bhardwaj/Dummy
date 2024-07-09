import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { LuUserCircle2 } from "react-icons/lu";
import axios from 'axios'
import toast from 'react-hot-toast';


const VerifyEmail = () => {
  const [data,setData]=useState({
      email: "",
  })
  const navigate=useNavigate();
  const changeHandler=(e)=>{
    const {name,value}=e.target;
    setData({...data,[name]:value})
  }
  
  const  submitHandler=async (e)=>{
    e.preventDefault();
    e.stopPropagation();
    const url=`${process.env.REACT_APP_BACKEND_URL}/api/v1/email`;
    try{
      const response =await axios.post(url,data);
      toast.success(response?.data?.message);
      if(response.data.success){
        setData({
          email: "",
        });
        navigate('/password',{
          state:response?.data?.data
        });
      }
      
    }catch(err){
      toast.error(err?.response?.data?.message);
      
    }
    
  }
  return (
    <div className=' mt-5  flex justify-center'>
      <div className=' bg-white max-w-sm w-full mx-2 rounded p-4 overflow-hidden '>
        <div className='w-fit mx-auto mb-2'>
        <LuUserCircle2 size={100}  className=' opacity-85'/>

        </div>
        <h3>Welcome to Chatify!</h3>
        <form className='grid gap-4 mt-5' onSubmit={submitHandler}>
          

          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email :</label>
            <input 
            type='email' 
            id='email' 
            name='email' 
            value={data.email}
            onChange={changeHandler}
            required
            placeholder='Enter your email' className=' bg-slate-100 px-2 py-1 rounded focus:outline-primary '/>
          </div>

          <button 
            
           
            className=' font-bold text-white mt-2 px-4 text-lg py-2 rounded bg-primary hover:bg-secondry transition'>Let's Go</button>
        </form>

        <p className='my-2 text-center'>New User ? <Link to={"/register"} className=' font-semibold hover:text-primary '>Register</Link></p>
      </div>
    </div>
  )
}

export default VerifyEmail
