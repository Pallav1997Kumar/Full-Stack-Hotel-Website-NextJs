import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import NonContinousMultipleDatesBookingInfo from "@/database models/booking models/events meetings models/nonContinousMultipleDatesBookingInfo.js";
import Connection from "@/database config/config.js";
import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { INFORMATION_ADD_TO_NON_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";


Connection();

async function POST(NextRequest, context){
    try{
        const params = context.params;
        const loginUserId = params.userId;
        const customerId = loginUserId;
        const body = await NextRequest.json();
        
        const roomBookingDateType = body.eventMeetingRoomBookingInfoDetail.cartInfo.roomBookingDateType;
        const meetingEventsInfoTitle = body.eventMeetingRoomBookingInfoDetail.cartInfo.meetingEventsInfoTitle;
        const totalPriceOfAllDates = body.eventMeetingRoomBookingInfoDetail.cartInfo.totalPriceOfAllDates;
        const allDatesBookingInformation = body.eventMeetingRoomBookingInfoDetail.cartInfo.allDatesBookingInformation;
        const transactionId = body.transactionId;

        const hotelUser = await HotelCustomersUsers.findById(loginUserId);
        if(hotelUser){
            const newNonContinousMultipleDatesEventMeetingBookingInfo = new NonContinousMultipleDatesBookingInfo({
                customerId,
                transactionId,
                roomBookingDateType,
                meetingEventsInfoTitle,
                totalPriceOfAllDates,
                allDatesBookingInformation
            });
            await newNonContinousMultipleDatesEventMeetingBookingInfo.save();
            return NextResponse.json(
                { message: INFORMATION_ADD_TO_NON_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL },
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
        console.log('src/app/api/add-booking/meeting-events/multiple-dates-non-continous/[userId]/route.js');
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST }