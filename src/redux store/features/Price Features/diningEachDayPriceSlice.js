import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    eachDayDiningPrice: [],
    error: null,
    loading: false
}

const NAME = 'diningEachDayPriceSliceName';
const THUNK_NAME = 'diningEachDayPrice/getDiningEachDayPrice';

export const getDiningEachDayPrice = createAsyncThunk(THUNK_NAME, async function(args, {rejectWithValue}){
    try{
        const response = await fetch('/api/hotel-booking-information/dining-information/each-day-information/');
        const data = await response.json();
        return data;
    }
    catch(error){
        rejectWithValue(error);
    }
});

export const diningEachDayPriceSlice = createSlice({
    name: NAME,
    initialState,
    reducers: {},
    extraReducers: function(builder){
        builder
            .addCase(getDiningEachDayPrice.pending, function(state){
                state.loading = true;
            })
            .addCase(getDiningEachDayPrice.fulfilled, function(state, action){
                state.loading = false;
                state.error = null;
                state.eachDayDiningPrice = action.payload;
            })
            .addCase(getDiningEachDayPrice.rejected, function(state, action){
                state.loading = false;
                state.error = action.payload;
                state.eachDayDiningPrice = [];
            })
    },
});

export default diningEachDayPriceSlice.reducer;