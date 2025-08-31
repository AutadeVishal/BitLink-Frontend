import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"userSlice",//this is used for naming like in redux dev tool on chrome 
    initialState:null,
    reducers:{
        setUser(state, action){
            return action.payload;
        },
        removeUser(state){
            return null;
        }
    }
})
export default userSlice.reducer;//userSlice is const here in both 
export const {setUser,removeUser}=userSlice.actions;