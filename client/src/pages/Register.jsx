import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios'
import toast from 'react-hot-toast';

//2:29:40

const Register = () => {
  const [data,setData]=useState({
    name:"",
    email: "",
    password: "",
    profilePic:""
  })
  const navigate=useNavigate();
  const [UploadPhoto,setUploadPhoto]=useState("");
  const changeHandler=(e)=>{
    const {name,value}=e.target;
    setData({...data,[name]:value})
  }
  const photoUploadHandler=async (e)=>{
    
    const file=e.target.files[0];
    try{

      const uploadPhoto = await uploadFile(file)
      setData((preve)=>{
        return{
          ...preve,
          profilePic : uploadPhoto?.url
        }
      })
    }catch(err){
      console.log(err);
    }

    setUploadPhoto(file)

    

  }
  const removeImage=(e)=>{
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto("");
  }

  const  submitHandler=async (e)=>{
    e.preventDefault();
    e.stopPropagation();
    const url=`${process.env.REACT_APP_BACKEND_URL}/api/v1/register`;
    try{
      const response =await axios.post(url,data);
      toast.success(response?.data?.message);
      if(response.data.success){
        setData({
          name:"",
          email: "",
          password: "",
          profilePic:""
        });
        navigate('/email');
      }
      
    }catch(err){
      toast.error(err?.response?.data?.message);
      
    }
    
  }
  
  return (
    <div className=' mt-5  flex justify-center'>
      <div className=' bg-white max-w-sm w-full mx-2 rounded p-4 overflow-hidden '>
        <h3>Welcome to Chatify!</h3>
        <form className='grid gap-4 mt-5' onSubmit={submitHandler}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name :</label>
            <input 
            type='text' 
            id='name' 
            name='name' 
            value={data.name}
            onChange={changeHandler}
            required
            placeholder='Enter your name' className=' bg-slate-100 px-2 py-1 rounded focus:outline-primary '/>
          </div>

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

          <div className='flex flex-col gap-1'>
            <label htmlFor='profilePic'>Profile Picture :
            <div className='h-14 bg-slate-200 flex justify-center items-center border-2 rounded hover:border-primary cursor-pointer'>
              <p className=' text-sm max-w-[300px]  text-ellipsis line-clamp-1'>
                {
                  UploadPhoto?.name?UploadPhoto?.name:"Upload profile picture"
                }
                </p>
                {
                  UploadPhoto?.name&&(

                <button className=' text-lg ml-2 hover:text-red-600'  onClick={removeImage}>
                <IoClose />

                </button>
                  )
                }
            </div>
            </label>
            <input 
            type='file' 
            id='profilePic' 
            name='profilePic' 
            onChange={photoUploadHandler}
            className=' bg-slate-100 px-2 py-1 rounded focus:outline-primary hidden '/>
          </div>
          <button 
            
           
            className=' font-bold text-white mt-2 px-4 text-lg py-2 rounded bg-primary hover:bg-secondry transition'>Register</button>
        </form>

        <p className='my-2 text-center'>Already have account? <Link to={"/email"} className=' font-semibold hover:text-primary '>Login</Link></p>
      </div>
    </div>
  )
}

export default Register
