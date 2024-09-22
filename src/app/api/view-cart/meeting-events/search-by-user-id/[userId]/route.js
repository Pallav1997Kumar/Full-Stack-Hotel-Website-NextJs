import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import SingleDateCartInfo from "@/database models/booking models/events meetings models/singleDateCartInfo.js";
import NonContinousMultipleDatesCartInfo from "@/database models/booking models/events meetings models/nonContinousMultipleDatesCartInfo.js";
import ContinousMultipleDatesCartInfo from "@/database models/booking models/events meetings models/continousMultipleDatesCartInfo.js";

import Connection from "@/database config/config.js";

import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { EVENT_MEETING_ROOM_PRESENT_IN_CART, EVENT_MEETING_ROOM_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";

Connection();


async function GET(NextRequest, context){
    try {
        const params = context.params;
        const loginUserId = params.userId;

        const hotelUser = await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const cartEventMeetingSingleDateUser = await SingleDateCartInfo.find( { customerId: loginUserId } );
            const cartEventMeetingMultipleContinousDatesUser = await ContinousMultipleDatesCartInfo.find( { customerId: loginUserId } );
            const cartEventMeetingMultipleNonContinousDatesUser = await NonContinousMultipleDatesCartInfo.find( { customerId: loginUserId } );

            if(cartEventMeetingSingleDateUser
                || cartEventMeetingMultipleContinousDatesUser
                || cartEventMeetingMultipleNonContinousDatesUser){

                if(cartEventMeetingSingleDateUser.length > 0 
                    || cartEventMeetingMultipleContinousDatesUser.length > 0 
                    || cartEventMeetingMultipleNonContinousDatesUser.length > 0){

                        const eventMeetingCartInfo = [
                            ...cartEventMeetingSingleDateUser,
                            ...cartEventMeetingMultipleContinousDatesUser,
                            ...cartEventMeetingMultipleNonContinousDatesUser
                        ]

                    return NextResponse.json(
                        { message: EVENT_MEETING_ROOM_PRESENT_IN_CART, eventMeetingCartInfo },
                        { status: 200 }
                    );
                }
                else{
                    return NextResponse.json(
                        { message: EVENT_MEETING_ROOM_CART_IS_EMPTY },
                        { status: 200 }
                    );
                }
            }
            else{
                return NextResponse.json(
                    { message: EVENT_MEETING_ROOM_CART_IS_EMPTY },
                    { status: 200 }
                );
            }
        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { GET }