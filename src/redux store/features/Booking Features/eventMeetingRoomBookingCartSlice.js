import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    eventMeetingCart : []
}

const eventMeetingRoomBookingCartSlice = createSlice({
    name: "eventMeetingCartSlice",
    initialState,
    reducers: {
        showEventMeetingCart: function(state){
            state.eventMeetingCart = state.eventMeetingCart;
        },
        addNewBookingToEventMeetingCart: function(state, action){
            const oldEventMeetingCartInfo = state.eventMeetingCart;
            const newEventMeetingInfo = action.payload;
            state.eventMeetingCart = [...oldEventMeetingCartInfo, newEventMeetingInfo];
        },
        deleteParticularBookingFromEventMeetingCart: function(state, action){
            const oldEventMeetingCartInfo = state.eventMeetingCart;
            const removeEventCartId = action.payload;
            const updatedEventMeetingCartInfo = oldEventMeetingCartInfo.filter(function(eachRoom){
                return (eachRoom.eventCartId != removeEventCartId)
            });
            state.eventMeetingCart = updatedEventMeetingCartInfo;
        }
    }
});

export { eventMeetingRoomBookingCartSlice };
export const { showEventMeetingCart, addNewBookingToEventMeetingCart, deleteParticularBookingFromEventMeetingCart } = eventMeetingRoomBookingCartSlice.actions;
export default eventMeetingRoomBookingCartSlice.reducer;