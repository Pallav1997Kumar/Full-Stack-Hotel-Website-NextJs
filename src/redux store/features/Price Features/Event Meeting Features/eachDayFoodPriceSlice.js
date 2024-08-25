import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    eachDayFoodPrice: [],
    error: null,
    loading: false
}

const NAME = 'eventMeetingEachDayFoodPriceSliceName';
const THUNK_NAME = 'eventMeetingEachDayFoodPrice/getEventsFoodPrice';

export const getEventsFoodPrice = createAsyncThunk(THUNK_NAME, async function(args, {rejectWithValue}){
    try{
        const response = await fetch('/api/hotel-booking-information/events-meeting-room-information/each-day-food-price/');
        const data = await response.json();
        return data;
    }
    catch(error){
        rejectWithValue(error);
    }
});

export const eachDayFoodPriceSlice = createSlice({
    name: NAME,
    initialState,
    reducers: {},
    extraReducers: function(builder){
        builder
            .addCase(getEventsFoodPrice.pending, function(state){
                state.loading = true;
            })
            .addCase(getEventsFoodPrice.fulfilled, function(state, action){
                state.loading = false;
                state.error = null;
                state.eachDayFoodPrice = action.payload;
            })
            .addCase(getEventsFoodPrice.rejected, function(state, action){
                state.loading = false;
                state.error = action.payload;
                state.eachDayFoodPrice = [];
            })
    }
});

export default eachDayFoodPriceSlice.reducer;