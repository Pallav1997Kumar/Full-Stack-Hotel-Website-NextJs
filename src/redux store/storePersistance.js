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


const rootReducer = combineReducers({
  roomCartSlice: roomBookingCartSliceReducer,
  diningCartSlice: diningBookingCartSliceReducer,
  eventMeetingCartSlice: eventMeetingRoomBookingCartSliceReducer,
  userSlice: loginUserDetailsSliceReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["roomCartSlice", "diningCartSlice", "eventMeetingCartSlice" , "userSlice"], // reducers you want to persist
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
