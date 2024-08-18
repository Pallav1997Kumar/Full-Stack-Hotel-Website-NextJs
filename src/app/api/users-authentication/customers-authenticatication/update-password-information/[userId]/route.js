import { NextRequest, NextResponse } from "next/server";
import {cookies} from "next/headers";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import Connection from "@/database config/config.js";

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
                    { message: 'Password Updated Successfully' },
                    { status: 200 }
                );
            }
            else{
                return NextResponse.json(
                    { errorMessage: 'Incorrect Old Password' },
                    { status: 404 }
                );
            }
        }
        else{
            return NextResponse.json(
                { errorMessage: 'User not Found!' },
                { status: 404 }
            );
        }
    }
    catch(error){
        return NextResponse.json(
            { error: 'Internal Server Error' }, 
            { status: 500 }
        );
    }
}

export { PATCH }