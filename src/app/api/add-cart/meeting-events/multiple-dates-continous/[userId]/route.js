import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import ContinousMultipleDatesCartInfo from "@/database models/booking models/events meetings models/continousMultipleDatesCartInfo.js";
import Connection from "@/database config/config.js";
import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { INFORMATION_ADD_TO_CART_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";


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
        const meetingEventStartBookingDate = body.meetingEventStartBookingDate;
        const meetingEventEndBookingDate = body.meetingEventEndBookingDate;
        const meetingEventBookingTime = body.meetingEventBookingTime;
        const meetingEventSeatingArrangement = body.meetingEventSeatingArrangement;
        const maximumGuestAttending = body.maximumGuestAttending;
        const wantFoodServices = body.wantFoodServices;
        const selectedMealsOnBookingDate = body.selectedMealsOnBookingDate;
        const totalPriceEventMeetingRoom = body.totalPriceEventMeetingRoom;

        const hotelUser = await HotelCustomersUsers.findById(loginUserId);
        if(hotelUser){
            const newContinousMultipleDatesEventMeetingCartInfo = new ContinousMultipleDatesCartInfo({
                customerId,
                eventCartId,
                roomBookingDateType,
                meetingEventsInfoTitle,
                meetingEventStartBookingDate,
                meetingEventEndBookingDate,
                meetingEventBookingTime,
                meetingEventSeatingArrangement,
                maximumGuestAttending,
                wantFoodServices,
                selectedMealsOnBookingDate,
                totalPriceEventMeetingRoom
            });
            await newContinousMultipleDatesEventMeetingCartInfo.save();
            return NextResponse.json(
                { message: INFORMATION_ADD_TO_CART_SUCCESSFUL },
                { status: 200 }
            );
        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
            );
        }
    }
    catch(error){
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST }