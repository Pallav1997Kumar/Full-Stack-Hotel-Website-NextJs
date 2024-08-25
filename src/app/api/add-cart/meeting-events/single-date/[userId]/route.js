import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import SingleDateCartInfo from "@/database models/booking models/events meetings models/singleDateCartInfo.js";

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
        const meetingEventBookingDate = body.meetingEventBookingDate;
        const meetingEventBookingTime = body.meetingEventBookingTime;
        const meetingEventSeatingArrangement = body.meetingEventSeatingArrangement;
        const maximumGuestAttending = body.maximumGuestAttending;
        const wantFoodServices = body.wantFoodServices;
        const selectedMealsOnBookingDate = body.selectedMealsOnBookingDate;
        const totalPriceEventMeetingRoom = body.totalPriceEventMeetingRoom;

        const hotelUser = await HotelCustomersUsers.findById(loginUserId);
        if(hotelUser){
            const newSingleDateEventMeetingCartInfo = new SingleDateCartInfo({
                customerId,
                eventCartId,
                roomBookingDateType,
                meetingEventsInfoTitle,
                meetingEventBookingDate,
                meetingEventBookingTime,
                meetingEventSeatingArrangement,
                maximumGuestAttending,
                wantFoodServices,
                selectedMealsOnBookingDate,
                totalPriceEventMeetingRoom
            });
            await newSingleDateEventMeetingCartInfo.save();
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