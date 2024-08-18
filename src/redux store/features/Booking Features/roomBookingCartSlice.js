import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    roomCart : []
}

const roomBookingCartSlice = createSlice({
    name: "roomCartSlice",
    initialState,
    reducers: {
        showRoomCart: function(state){
            state.roomCart = state.roomCart;
        },
        addNewBookingToRoomCart: function(state, action){
            const oldRoomCartInfo = state.roomCart;
            const newRoomInfo = action.payload;
            state.roomCart = [...oldRoomCartInfo, newRoomInfo];
        },
        deleteParticularBookingFromRoomCart: function(state, action){
            const oldRoomCartInfo = state.roomCart;
            const removeRoomId = action.payload;
            const updatedRoomCart = oldRoomCartInfo.filter(function(eachRoom){
                return (eachRoom.roomCartId != removeRoomId)
            });
            state.roomCart = updatedRoomCart;
        }
    }
});

export { roomBookingCartSlice };
export const { showRoomCart, addNewBookingToRoomCart, deleteParticularBookingFromRoomCart } = roomBookingCartSlice.actions;
export default roomBookingCartSlice.reducer;