import { createSlice } from "@reduxjs/toolkit";

const feedSlice=createSlice({
    name:"feedslice",//this is used for naming like in redux dev tool on chrome 
    initialState:[],
    reducers:{
        setFeed(state, action){
            return action.payload;
        },
        removeFeedUser: (state, action) => { // renamed from removeUser
            const id = action.payload;
            return state.filter(user => user._id !== id);
        },
        removeFeed(state){
            return [];
        }
    }
})
export default feedSlice.reducer;//userSlice is const here in both 
export const {setFeed,removeFeed,removeFeedUser}=feedSlice.actions;