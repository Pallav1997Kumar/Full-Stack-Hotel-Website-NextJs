import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    diningBookingInfo : []
}


const diningBookingInfoSlice = createSlice({
    name: "diningBookingInfoSlice",
    initialState,
    reducers: {
        showDiningBookingInfo: function(state){
            state.diningBookingInfo = state.diningBookingInfo;
        },
        addDiningBookingInfo: function(state, action){
            const diningBookingInfo = action.payload;
            state.diningBookingInfo = diningBookingInfo;
        },
        resetDiningBookingInfo: function(state){
            state.diningBookingInfo = [];
        },
    }
});


export { diningBookingInfoSlice };
export const { showDiningBookingInfo, addDiningBookingInfo, resetDiningBookingInfo } = diningBookingInfoSlice.actions;
export default diningBookingInfoSlice.reducer;