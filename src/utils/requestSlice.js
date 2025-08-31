import { createSlice } from "@reduxjs/toolkit";

const requestSlice=createSlice({
    name:"requestSlice",
    initialState:null,
    reducers:{
        setRequest:(state,action)=>{
           return action.payload;
        },
        removeRequest:(state,action)=>{
            const newArray=state.filter((user)=>user._id!=action.payload);
            return newArray;
        }
        
    }
})
 export const {setRequest,removeRequest}=requestSlice.actions ;
 export default requestSlice.reducer;