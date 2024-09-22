import { configureStore } from "@reduxjs/toolkit";

import roomBookingCartSliceReducer from "./features/Booking Features/roomBookingCartSlice.js";
import diningBookingCartSliceReducer from "./features/Booking Features/diningBookingCartSlice.js";
import eventMeetingRoomBookingCartSliceReducer from "./features/Booking Features/eventMeetingRoomBookingCartSlice.js";

import loginUserDetailsSliceReducer from "./features/Auth Features/loginUserDetailsSlice.js";
import loginPageCalledFromSliceReducer from "./features/Login Page Called From Features/loginPageCalledFromSlice.js";

import roomsSuitesEachDayPriceSliceReducer from "./features/Price Features/roomsSuitesEachDayPriceSlice.js";
import diningEachDayPriceSliceReducer from "./features/Price Features/diningEachDayPriceSlice.js";
import eachDayFoodPriceSliceReducer from "./features/Price Features/Event Meeting Features/eachDayFoodPriceSlice.js";
import eachDayInformationSliceReducer from "./features/Price Features/Event Meeting Features/eachDayInformationSlice.js";
import eachDaySeatingArrangementSliceReducer from "./features/Price Features/Event Meeting Features/eachDaySeatingArrangementSlice.js";

import diningBookingInfoSliceReducer from "./features/Booking Information/diningBookingInfoSlice.js";
import roomSuiteBookingInfoSliceReducer from "./features/Booking Information/roomSuiteBookingInfoSlice.js";
import eventMeetingBookingInfoSliceReducer from "./features/Booking Information/eventMeetingBookingInfoSlice.js";


export const store = configureStore({
    reducer: {
        roomCartSlice: roomBookingCartSliceReducer,
        diningCartSlice: diningBookingCartSliceReducer,
        eventMeetingCartSlice: eventMeetingRoomBookingCartSliceReducer,
        userSlice: loginUserDetailsSliceReducer,
        loginPageCalledFromSliceName: loginPageCalledFromSliceReducer,
        diningEachDayPriceSliceName: diningEachDayPriceSliceReducer,
        roomsSuitesEachDayPriceSliceName: roomsSuitesEachDayPriceSliceReducer,
        eventMeetingEachDayFoodPriceSliceName: eachDayFoodPriceSliceReducer,
        eventMeetingEachDayInformationSliceName: eachDayInformationSliceReducer,
        eventMeetingEachDaySeatingArrangementSliceName: eachDaySeatingArrangementSliceReducer,
        diningBookingInfoSlice: diningBookingInfoSliceReducer,
        roomSuiteBookingInfoSlice: roomSuiteBookingInfoSliceReducer,
        eventMeetingBookingInfoSlice: eventMeetingBookingInfoSliceReducer
    }
});