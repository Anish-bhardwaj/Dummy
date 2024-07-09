import React, { useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadFile from '../helpers/uploadFile';
import axios from 'axios'
import toast from 'react-hot-toast';
import Avatar from './Avatar';
import Divider from './Divider';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';


const EditUser = ({ onClose,user}) => {
    const [data,setData]=useState({
        name:user?.name,
        
        profilePic:user?.profilePic
      })

        const dispatch=useDispatch();
      useEffect(()=>{
        setData((preve)=>{
            return {
                ...preve,
                ...user
            }
        })
      },[user])
      const changeHandler=(e)=>{
        const {name,value}=e.target;
        setData({...data,[name]:value})
      }
      
        const  submitHandler=async (e)=>{
            e.preventDefault();
            e.stopPropagation();
            const url=`${process.env.REACT_APP_BACKEND_URL}/api/v1/updateUserDetails`;

            try{
                const response =await axios({
                    method:'post',
                    url:url,
                    data:data,
                    withCredentials:true
                });
                toast.success(response?.data?.message);
                dispatch(setUser(response?.data?.data));
                onClose();
            }catch(err){
                toast.error(err?.response?.data?.message);
            }
        } 
        
        const photoUploadHandler=async (e)=>{
            e.preventDefault();
            e.stopPropagation();
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
        
            
        
            
        
          }
          
        
  return (
    <div  className='z-10 fixed top-0 right-0 bottom-0 left-0 bg-opacity-40 flex justify-center items-center  bg-gray-700'>
        <div className=' bg-white p-4 m-1 rounded w-full max-w-sm'> 
            <h2 className=' font-semibold'>Profile Details</h2>
            <p className=' text-sm'>Edit User Details</p>
            <form className='grid gap-4 mt-3' onSubmit={submitHandler}>
                <div className='flex flex-col gap-1'>
                <label htmlFor='name'>Name :</label>
                <input 
                type='text' 
                id='name' 
                name='name' 
                value={data.name}
                onChange={changeHandler}
                required
                placeholder='Enter your name' className=' bg-slate-100 px-2 py-1 border rounded focus:outline-primary '/>
            </div>
            
            <div className='flex items-center my-1 gap-4'>

                <Avatar width={40} height={40} imageUrl={data?.profilePic} name={data?.name}/>
                <div className='flex flex-col'>
                    <label htmlFor='profilePic' className=' cursor-pointer'> Change Profile Picture
            
                    </label>
                    <input 
                    type='file' 
                    id='profilePic' 
                    name='profilePic' 
                    onChange={photoUploadHandler}
                    className=' bg-slate-100 px-2 py-1 rounded focus:outline-primary hidden '/>
                </div>
            </div>

            <Divider/>
            <div className='flex gap-2 w-fit ml-auto mt-3 '>
                <button onClick={onClose} className=' py-1 px-4 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-all duration-300'>Cancel</button>
                <button onSubmit={submitHandler} className=' py-1 px-4 border border-primary bg-primary rounded hover:bg-secondry'>Save</button>
            </div>
            </form>
        </div>
    </div>
  )
}

export default EditUser
