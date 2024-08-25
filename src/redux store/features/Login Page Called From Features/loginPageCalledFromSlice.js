import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loginPageCalledFrom: null,
    loginRedirectPage: '/profile-home-page'
}

export const loginPageCalledFromSlice = createSlice({
    name: 'loginPageCalledFromSliceName',
    initialState,
    reducers: {
        getLoginPageCalledFrom: function(state){
            return state.loginPageCalledFrom;
        },
        getLoginRedirectPage: function(state){
            return state.loginRedirectPage;
        },
        updateLoginPageCalledFrom: function(state, action){
            state.loginPageCalledFrom = action.payload;
        },
        updateLoginRedirectPage: function(state, action){
            state.loginRedirectPage = action.payload;
        }
    }
});

export const { getLoginPageCalledFrom, getLoginRedirectPage, updateLoginPageCalledFrom, updateLoginRedirectPage } = loginPageCalledFromSlice.actions;
export default loginPageCalledFromSlice.reducer;