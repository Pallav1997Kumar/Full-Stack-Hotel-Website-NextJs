import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    roomSuiteBookingInfo : []
}


const roomSuiteBookingInfoSlice = createSlice({
    name: "roomSuiteBookingInfoSlice",
    initialState,
    reducers: {
        showRoomSuiteBookingInfo: function(state){
            state.roomSuiteBookingInfo = state.roomSuiteBookingInfo;
        },
        addRoomSuiteBookingInfo: function(state, action){
            const roomSuiteBookingInfo = action.payload;
            state.roomSuiteBookingInfo = roomSuiteBookingInfo;
        },
        resetRoomSuiteBookingInfo: function(state, action){
            state.roomSuiteBookingInfo = [];
        },
    }
});


export { roomSuiteBookingInfoSlice };
export const { showRoomSuiteBookingInfo, addRoomSuiteBookingInfo, resetRoomSuiteBookingInfo } = roomSuiteBookingInfoSlice.actions;
export default roomSuiteBookingInfoSlice.reducer;