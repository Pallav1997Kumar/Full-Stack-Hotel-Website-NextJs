import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    eachDayRoomSuitesPrice: [],
    error: null,
    loading: false
}

const NAME = 'roomsSuitesEachDayPriceSliceName';
const THUNK_NAME = 'roomsSuitesEachDayPrice/getRoomsSuitesEachDayPrice'

export const getRoomsSuitesEachDayPrice = createAsyncThunk(THUNK_NAME, async function(args, {rejectWithValue}){
    try{
        const response = await fetch('/api/hotel-booking-information/room-and-suites-information/each-day-information/');
        const data = await response.json();
        return data;
    }
    catch(error){
        rejectWithValue(error);
    }
});

export const roomsSuitesEachDayPriceSlice = createSlice({
    name: NAME,
    initialState,
    reducers: {},
    extraReducers: function(builder){
        builder
            .addCase(getRoomsSuitesEachDayPrice.pending, function(state){
                state.loading = true;
            })
            .addCase(getRoomsSuitesEachDayPrice.fulfilled, function(state, action){
                state.loading = false;
                state.error = null;
                state.eachDayRoomSuitesPrice = action.payload;
            })
            .addCase(getRoomsSuitesEachDayPrice.rejected, function(state, action){
                state.loading = false;
                state.error = action.payload;
                state.eachDayRoomSuitesPrice = [];
            })
    }
});

export default roomsSuitesEachDayPriceSlice.reducer;