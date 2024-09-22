import { NextRequest, NextResponse } from "next/server";
import NonContinousMultipleDatesCartInfo from "@/database models/booking models/events meetings models/nonContinousMultipleDatesCartInfo.js";
import Connection from "@/database config/config.js";

import { INTERNAL_SERVER_ERROR, CART_ID_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";


Connection();


async function GET(NextRequest, context){
    try{
        const params = context.params;
        const cartId = params.cartId;

        const eventMeetingNonContinousMultipleDatesCartInfo = await NonContinousMultipleDatesCartInfo.findById(cartId);

        if(eventMeetingNonContinousMultipleDatesCartInfo){
            return NextResponse.json(
                { cartInfo: eventMeetingNonContinousMultipleDatesCartInfo }, 
                { status: 200 }
            );
        }
        else{
            return NextResponse.json(
                { errorMessage: CART_ID_NOT_FOUND }, 
                { status: 404 }
            );
        }
    }
    catch (error){
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { GET }