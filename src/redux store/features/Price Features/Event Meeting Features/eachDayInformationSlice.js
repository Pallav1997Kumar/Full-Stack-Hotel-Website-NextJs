import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    eachDayInfomation: [],
    error: null,
    loading: false
}

const NAME = 'eventMeetingEachDayInformationSliceName';
const THUNK_NAME = 'eventMeetingEachDayInformation/getEventsEachDayPrice';

export const getEventsEachDayPrice = createAsyncThunk(THUNK_NAME, async function(args, {rejectWithValue}){
    try{
        const response = await fetch('/api/hotel-booking-information/events-meeting-room-information/each-day-information/');
        const data = await response.json();
        return data;
    }
    catch(error){
        rejectWithValue(error);
    }
});

export const eachDayInformationSlice = createSlice({
    name: NAME,
    initialState,
    reducers: {},
    extraReducers: function(builder){
        builder
            .addCase(getEventsEachDayPrice.pending, function(state){
                state.loading = true;
            })
            .addCase(getEventsEachDayPrice.fulfilled, function(state, action){
                state.loading = false;
                state.error = null;
                state.eachDayInfomation = action.payload;
            })
            .addCase(getEventsEachDayPrice.rejected, function(state, action){
                state.loading = false;
                state.error = action.payload;
                state.eachDayInfomation = [];
            })
    },
});

export default eachDayInformationSlice.reducer;