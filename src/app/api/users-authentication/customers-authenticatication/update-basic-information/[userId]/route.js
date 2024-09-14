import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import Connection from "@/database config/config.js";
import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { USER_INFORMATION_UPDATED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants.js";


Connection();

async function PATCH(NextRequest, context){
    try{
        const params = context.params;
        const loginUserId = params.userId;
        const body = await NextRequest.json();
        const { firstName, middleName, lastName, fullName, gender, dob, contactNo, alternateContactNo } = body;
        const hotelUser = await HotelCustomersUsers.findById(loginUserId);
        if(hotelUser){
            const updatedInfo = {
                firstName, 
                middleName,
                lastName,
                fullName,
                gender,
                dateOfBirth: dob,
                contactNo,
                alternateContactNo,
            }
            const updatedHotelUser = await HotelCustomersUsers.findByIdAndUpdate(loginUserId, {
                $set: updatedInfo
            });
            return NextResponse.json(
                { message: USER_INFORMATION_UPDATED_SUCCESSFULLY },
                { status: 200 }
            );
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