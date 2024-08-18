import { configureStore } from "@reduxjs/toolkit";
import roomBookingCartSliceReducer from "./features/Booking Features/roomBookingCartSlice.js";
import diningBookingCartSliceReducer from "./features/Booking Features/diningBookingCartSlice.js";
import eventMeetingRoomBookingCartSliceReducer from "./features/Booking Features/eventMeetingRoomBookingCartSlice.js";

export const store = configureStore({
    reducer: {
        roomCartSlice: roomBookingCartSliceReducer,
        diningCartSlice: diningBookingCartSliceReducer,
        eventMeetingCartSlice: eventMeetingRoomBookingCartSliceReducer
    }
});