import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import Connection from "@/database config/config.js";

Connection();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

async function POST(NextRequest){
    try{
        const body = await NextRequest.json();
        const { email, password } = body;

        const hotelUser = await HotelCustomersUsers.findOne( { emailAddress: email } );
        if(hotelUser){
            const hotelUserPasswordMatch = await HotelCustomersUsers.findOne({ $and: [{ emailAddress: email }, { password: password }] });
            if(hotelUserPasswordMatch){
                const tokenData = {
                    id: hotelUserPasswordMatch._id,
                    emailAddress: hotelUserPasswordMatch.emailAddress,
                }
                const loginUserDetails = {
                    userId: hotelUserPasswordMatch._id,
                    emailAddress: hotelUserPasswordMatch.emailAddress,
                    fullName: hotelUserPasswordMatch.fullName
                }
                const token = jwt.sign(tokenData,jwtSecretKey, { expiresIn: '1d' });
                const response =  NextResponse.json(
                    { message: 'Successful Login', loginUserDetails: loginUserDetails },
                    { status: 200 }
                );
                response.cookies.set('jwt-token', token, { httpOnly: true });
                return response; 
            }
            else{
                return NextResponse.json(
                    { errorMessage: 'Incorrect Password!' },
                    { status: 404 }
                ); 
            }
        }
        else{
            return NextResponse.json(
                { errorMessage: 'Email Address does not exist!' },
                { status: 404 }
            );
        }
    }
    catch(error){
        console.log(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export { POST };