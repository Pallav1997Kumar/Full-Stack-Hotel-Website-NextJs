import { NextRequest, NextResponse } from "next/server";
import ContinousMultipleDatesCartInfo from "@/database models/booking models/events meetings models/continousMultipleDatesCartInfo.js";
import Connection from "@/database config/config.js";

import { INTERNAL_SERVER_ERROR, CART_ID_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";


Connection();


async function GET(NextRequest, context){
    try{
        const params = context.params;
        const cartId = params.cartId;

        const eventMeetingContinousMultipleDatesCartInfo = await ContinousMultipleDatesCartInfo.findById(cartId);

        if(eventMeetingContinousMultipleDatesCartInfo){
            return NextResponse.json(
                { cartInfo: eventMeetingContinousMultipleDatesCartInfo }, 
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