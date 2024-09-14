import { NextRequest, NextResponse } from "next/server";
import {cookies} from "next/headers";
import { INTERNAL_SERVER_ERROR } from "@/constant string files/apiErrorMessageConstants.js";
import { LOGOUT_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants.js";


const jwtSecretKey = process.env.JWT_SECRET_KEY;

async function POST(NextRequest){
    try{
        const response =  NextResponse.json(
            { message: LOGOUT_SUCCESSFULLY },
            { status: 200 }
        );
        cookies().delete('jwt-token');
        return response;
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            { error: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST };