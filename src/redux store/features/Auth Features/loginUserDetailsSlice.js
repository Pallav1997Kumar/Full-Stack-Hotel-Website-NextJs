import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    loginUserDetails: null
}


export const loginUserDetailsSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        getLoginUserDetails: function(state){
            return state.loginUserDetails;
        },
        login: function(state, action){
            state.loginUserDetails = action.payload;
        },
        updateUserDetails: function(state, action){
            state.loginUserDetails = action.payload;
        },
        logout: function(state){
            state.loginUserDetails = null;
        }
    }
});


export const { getLoginUserDetails, login, updateUserDetails, logout } = loginUserDetailsSlice.actions;
export default loginUserDetailsSlice.reducer;