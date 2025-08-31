import { createSlice } from "@reduxjs/toolkit";

const feedSlice=createSlice({
    name:"feedslice",//this is used for naming like in redux dev tool on chrome 
    initialState:[],
    reducers:{
        setFeed(state, action){
            return action.payload;
        },
        removeUser:(state,action)=>{
            const newArray=state.filter((user)=>user._id!=action.payload);
            return newArray;
        },
        removeFeed(state){
            return [];
        }
    }
})
export default feedSlice.reducer;//userSlice is const here in both 
export const {setFeed,removeFeed,removeUser}=feedSlice.actions;