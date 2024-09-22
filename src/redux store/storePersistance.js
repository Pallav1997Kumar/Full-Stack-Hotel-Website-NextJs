import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { createWrapper } from "next-redux-wrapper";

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


const rootReducer = combineReducers({
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
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["roomCartSlice", "diningCartSlice", "eventMeetingCartSlice" , 
    "userSlice", "loginPageCalledFromSliceName", 
    "diningEachDayPriceSliceName", "roomsSuitesEachDayPriceSliceName",
    "eventMeetingEachDayFoodPriceSliceName", "eventMeetingEachDayInformationSliceName", "eventMeetingEachDaySeatingArrangementSliceName", 
    "diningBookingInfoSlice", "roomSuiteBookingInfoSlice", "eventMeetingBookingInfoSlice"], // reducers you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
  });

export const wrapper = createWrapper(makeStore);

export const storePersistance = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(storePersistance); // Create persistor explicitly
