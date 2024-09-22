import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    eventMeetingBookingInfo : []
}


const eventMeetingBookingInfoSlice = createSlice({
    name: "eventMeetingBookingInfoSlice",
    initialState,
    reducers: {
        showEventMeetingSuiteBookingInfo: function(state){
            state.eventMeetingBookingInfo = state.eventMeetingBookingInfo;
        },
        addEventMeetingBookingInfo: function(state, action){
            const eventMeetingBookingInfo = action.payload;
            state.eventMeetingBookingInfo = eventMeetingBookingInfo;
        },
        resetEventMeetingBookingInfo: function(state, action){
            state.eventMeetingBookingInfo = [];
        },
    }
});


export { eventMeetingBookingInfoSlice };
export const { showEventMeetingSuiteBookingInfo, addEventMeetingBookingInfo, resetEventMeetingBookingInfo } = eventMeetingBookingInfoSlice.actions;
export default eventMeetingBookingInfoSlice.reducer;