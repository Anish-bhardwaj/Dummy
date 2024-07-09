import React from 'react'
import logo from '../assets/logo.png'

const AuthLayouts = ({children}) => {
  return (
    <>
        <header className=' w-full flex justify-center items-center py-3 h-20 shadow-md bg-white'>
            <img src={logo} alt="logo" className="logo h-full"   />
        </header>
        {children}
    </>
  )
}

export default AuthLayouts
