import { NextRequest, NextResponse } from "next/server";
import {cookies} from "next/headers";

const jwtSecretKey = process.env.JWT_SECRET_KEY;

async function POST(NextRequest){
    try{
        const response =  NextResponse.json(
            { message: 'Logout Successfully' },
            { status: 200 }
        );
        cookies().delete('jwt-token');
        return response;
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            { error: 'Internal Server Error' }, 
            { status: 500 }
        );
    }
}

export { POST };