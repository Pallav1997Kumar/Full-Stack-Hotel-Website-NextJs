import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import NonContinousMultipleDatesCartInfo from "@/database models/booking models/events meetings models/nonContinousMultipleDatesCartInfo.js";

import Connection from "@/database config/config.js";

Connection();

async function POST(NextRequest, context){
    try{
        const params = context.params;
        const loginUserId = params.userId;
        const customerId = loginUserId;
        const body = await NextRequest.json();
        
        const eventCartId = body.eventCartId;
        const roomBookingDateType = body.roomBookingDateType;
        const meetingEventsInfoTitle = body.meetingEventsInfoTitle;
        const totalPriceOfAllDates = body.totalPriceOfAllDates;
        const allDatesBookingInformation = body.allDatesBookingInformation;

        const hotelUser = await HotelCustomersUsers.findById(loginUserId);
        if(hotelUser){
            const newNonContinousMultipleDatesEventMeetingCartInfo = new NonContinousMultipleDatesCartInfo({
                customerId,
                eventCartId,
                roomBookingDateType,
                meetingEventsInfoTitle,
                totalPriceOfAllDates,
                allDatesBookingInformation
            });
            await newNonContinousMultipleDatesEventMeetingCartInfo.save();
            return NextResponse.json(
                { message: 'Cart Information Successfully Added To Cart' },
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
            { errorMessage: 'Internal Server Error' }, 
            { status: 500 }
        );
    }
}

export { POST }