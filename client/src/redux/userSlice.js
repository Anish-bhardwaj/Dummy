import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    _id:"",
    name:"",
    email:"",
    profilePic:"",
    token:"",
    onlineUser:"",
    socketConnection:null
  },
  reducers: {
    setUser:(state,action)=>{
        state._id=action.payload._id
        state.email=action.payload.email
        state.name=action.payload.name
        state.profilePic=action.payload.profilePic
    },
    setToken:(state,action)=>{
        state.token=action.payload
    },
    logout:(state,action)=>{
        state._id=""
        state.email=""
        state.name=""
        state.profilePic=""
        state.token=""
        state.socketConnection=null
    },
    setOnlineUser:(state,action)=>{
      state.onlineUser=action.payload
    },
    setsocketConnection:(state,action)=>{
      state.socketConnection=action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const {setUser,setToken,logout,setOnlineUser ,setsocketConnection} = userSlice.actions

export default userSlice.reducer