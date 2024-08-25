import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    eachDaySeatingArrangement: [],
    error: null,
    loading: false
}

const NAME = 'eventMeetingEachDaySeatingArrangementSliceName';
const THUNK_NAME = 'eventMeetingEachDaySeatingArrangement/getEventsSeatingArrangementPrice'

export const getEventsSeatingArrangementPrice = createAsyncThunk(THUNK_NAME, async function(args, {rejectWithValue}){
    try{
        const response = await fetch('/api/hotel-booking-information/events-meeting-room-information/each-seating-arrangement-price/');
        const data = await response.json();
        return data;
    }
    catch(error){
        rejectWithValue(error);
    }
});

export const eachDaySeatingArrangementSlice = createSlice({
    name: NAME,
    initialState,
    reducers: {},
    extraReducers: function(builder){
        builder
            .addCase(getEventsSeatingArrangementPrice.pending, function(state){
                state.loading = true;
            })
            .addCase(getEventsSeatingArrangementPrice.fulfilled, function(state, action){
                state.loading = false;
                state.error = null;
                state.eachDaySeatingArrangement = action.payload;
            })
            .addCase(getEventsSeatingArrangementPrice.rejected, function(state, action){
                state.loading = false;
                state.error = action.payload;
                state.eachDaySeatingArrangement = [];
            })
    },
});

export default eachDaySeatingArrangementSlice.reducer;