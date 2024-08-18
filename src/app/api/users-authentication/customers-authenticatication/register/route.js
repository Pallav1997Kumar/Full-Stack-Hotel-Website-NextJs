import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import Connection from "@/database config/config.js";

Connection();


async function POST(NextRequest){
    try{
        const body = await NextRequest.json();
        console.log(body);
        const { firstName, middleName, lastName, fullName, gender, dob, email, contactNo, alternateContactNo, password } = body;

        const hotelUser = await HotelCustomersUsers.findOne( { emailAddress: email } );
        if(hotelUser){
            return NextResponse.json(
                { errorMessage: 'Email Address already exist!' },
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
                { message: 'User Registered Successfully' },
                { status: 200 }
            );
        }
    }
    catch(error){
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export { POST };