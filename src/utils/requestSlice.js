import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name: "requestSlice",
    initialState: [], // was null
    reducers: {
        setRequest: (state, action) => {
            return action.payload || [];
        },
        removeRequest: (state, action) => {
            if (!Array.isArray(state)) return [];
            const id = action.payload;
            return state.filter(user => user._id !== id);
        }
    }
});
export const { setRequest, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;