import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import Connection from "@/database config/config.js";

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
                { message: 'User Infomation Updated Successfully' },
                { status: 200 }
            );
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