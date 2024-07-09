import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import Spinner from './Spinner';
import Card from './Card';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IoClose } from 'react-icons/io5';

const SearchBar = ({onClose}) => {
    const [searchUser,setSearchUser]=useState([]);
    const [loading,setLoading]=useState(false);
    const [search,setSearch]=useState("");
    const searchUserHandler=async ()=>{
        setLoading(true);
        try{
            const url=`${process.env.REACT_APP_BACKEND_URL}/api/v1/searchUsers`;
            const response=await axios.post(url,{
                search:search
            })
            
            setLoading(false);
            setSearchUser(response?.data?.data)
        }catch(err){
            toast.error(err?.response?.data?.message);
        }
    }
    
    useEffect(()=>{
        searchUserHandler()
    },[search]);
  return (
    <div className=' fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
        <div className=' w-full max-w-lg mx-auto mt-10'>
                {/* Input search */}
            <div className=' bg-white rounded h-14 overflow-hidden flex'>
                <input
                    type='text'
                    placeholder='Search user by name, email ...'
                    className=' w-full outline-none py-1 h-full px-4'
                    value={search}
                    onChange={(e)=>{setSearch(e.target.value)}}
                />
                <div className=' flex justify-center items-center h-14 w-14'>
                    <IoSearchOutline size={25}/>
                </div>
            </div>
                {/* Display users */}
                <div className=' bg-white mt-2 w-full p-4 rounded'>
                    {/* No user found */}
                    {
                        searchUser.length===0&&!loading &&(
                            <p className=' text-center text-slate-500 '>No user found!</p>
                        )
                    }
                    {
                        loading &&(
                            <p className=' flex gap-6 items-center '> <Spinner/>  <span>Loading....</span></p>
                        )
                    }


                    {
                        searchUser.length!==0 && !loading &&(
                            searchUser.map((user,index)=>{
                                return (
                                    <Card key={user._id} user={user} onClose={onClose}/>
                                )
                            })
                        )
                    }
                </div>
        </div>
        <div className=' absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white 'onClick={onClose} >
            <button>
            <IoClose />
            </button>
        </div>
    </div>
  )
}

export default SearchBar
