import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    diningCart : []
}

const diningBookingCartSlice = createSlice({
    name: "diningCartSlice",
    initialState,
    reducers: {
        showDiningCart: function(state){
            state.diningCart = state.diningCart;
        },
        addNewBookingToDiningCart: function(state, action){
            const oldDiningCartInfo = state.diningCart;
            const newDiningInfo = action.payload;
            state.diningCart = [...oldDiningCartInfo, newDiningInfo];
        },
        deleteParticularBookingFromDiningCart: function(state, action){
            const oldDiningCartInfo = state.diningCart;
            const removeDiningId = action.payload;
            const updatedDiningCart = oldDiningCartInfo.filter(function(eachDining){
                return (eachDining.diningCartId != removeDiningId)
            });
            state.diningCart = updatedDiningCart;
        },
    }
});

export { diningBookingCartSlice };
export const { showDiningCart, addNewBookingToDiningCart, deleteParticularBookingFromDiningCart } = diningBookingCartSlice.actions;
export default diningBookingCartSlice.reducer;