import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import Connection from "@/database config/config.js";
import { INTERNAL_SERVER_ERROR, REGISTRATION_ERROR_MESSAGE } from "@/constant string files/apiErrorMessageConstants.js";
import { USER_REGISTERED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants.js";


Connection();


async function POST(NextRequest){
    try{
        const body = await NextRequest.json();
        console.log(body);
        const { firstName, middleName, lastName, fullName, gender, dob, email, contactNo, alternateContactNo, password } = body;

        const hotelUser = await HotelCustomersUsers.findOne( { emailAddress: email } );
        if(hotelUser){
            return NextResponse.json(
                { errorMessage: REGISTRATION_ERROR_MESSAGE.EMAIL_ADDRESS_ALREADY_EXIST },
                { status: 404 }
            );
        }
        else{
            const accountBalance = 0;
            const newHotelCustomerUser = new HotelCustomersUsers({
                firstName,
                middleName,
                lastName,
                fullName,
                gender,
                dateOfBirth: dob,
                emailAddress: email,
                contactNo,
                alternateContactNo,
                password,
                accountBalance
            });
            await newHotelCustomerUser.save();
            return NextResponse.json(
                { message: USER_REGISTERED_SUCCESSFULLY },
                { status: 200 }
            );
        }
    }
    catch(error){
        return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 })
    }
}

export { POST };