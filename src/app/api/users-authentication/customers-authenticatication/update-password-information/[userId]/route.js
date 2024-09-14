import { NextRequest, NextResponse } from "next/server";
import {cookies} from "next/headers";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import Connection from "@/database config/config.js";

import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND, UPDATE_PASSWORD } from "@/constant string files/apiErrorMessageConstants.js";
import { PASSWORD_UPDATED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants.js";


Connection();

async function PATCH(NextRequest, context){
    const cookiesStore = cookies();
    const jwtTokenObject = cookiesStore.get('jwt-token');
    const jwtToken = jwtTokenObject.value;

    try{
        const params = context.params;
        const loginUserId = params.userId;
        const body = await NextRequest.json();
        const { oldPassword, newPassword } = body;
        const hotelUser = await HotelCustomersUsers.findById(loginUserId);
        if(hotelUser){
            const dbStoredPassword = hotelUser.password;
            if(oldPassword === dbStoredPassword){
                const updatedInfo = {
                    password: newPassword,
                }
                const updatedHotelUser = await HotelCustomersUsers.findByIdAndUpdate(loginUserId, {
                    $set: updatedInfo
                });
                return NextResponse.json(
                    { message: PASSWORD_UPDATED_SUCCESSFULLY },
                    { status: 200 }
                );
            }
            else{
                return NextResponse.json(
                    { errorMessage: UPDATE_PASSWORD.INCORRECT_OLD_PASSWORD },
                    { status: 404 }
                );
            }
        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
            );
        }
    }
    catch(error){
        return NextResponse.json(
            { error: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { PATCH }