import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import SingleDateCartInfo from "@/database models/booking models/events meetings models/singleDateCartInfo.js";
import NonContinousMultipleDatesCartInfo from "@/database models/booking models/events meetings models/nonContinousMultipleDatesCartInfo.js";
import ContinousMultipleDatesCartInfo from "@/database models/booking models/events meetings models/continousMultipleDatesCartInfo.js";

import Connection from "@/database config/config.js";

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
                        { message: 'Event and Meeting Rooms Present in Cart!', eventMeetingCartInfo },
                        { status: 200 }
                    );
                }
                else{
                    return NextResponse.json(
                        { message: 'Event and Meeting Rooms Cart is Empty!' },
                        { status: 200 }
                    );
                }
            }
            else{
                return NextResponse.json(
                    { message: 'Event and Meeting Rooms Cart is Empty!' },
                    { status: 200 }
                );
            }
        }
        else{
            return NextResponse.json(
                { errorMessage: 'User not Found!' },
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { errorMessage: 'Internal Server Error' }, 
            { status: 500 }
        );
    }
}


export { GET }