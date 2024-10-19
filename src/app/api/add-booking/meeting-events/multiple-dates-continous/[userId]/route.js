import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import ContinousMultipleDatesBookingInfo from "@/database models/booking models/events meetings models/continousMultipleDatesBookingInfo.js";
import Connection from "@/database config/config.js";
import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { INFORMATION_ADD_TO_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";


Connection();

async function POST(NextRequest, context){
    try{
        const params = context.params;
        const loginUserId = params.userId;
        const customerId = loginUserId;
        const body = await NextRequest.json();
        
        const roomBookingDateType = body.eventMeetingRoomBookingInfoDetail.cartInfo.roomBookingDateType;
        const meetingEventsInfoTitle = body.eventMeetingRoomBookingInfoDetail.cartInfo.meetingEventsInfoTitle;
        const meetingEventStartBookingDate = body.eventMeetingRoomBookingInfoDetail.cartInfo.meetingEventStartBookingDate;
        const meetingEventEndBookingDate = body.eventMeetingRoomBookingInfoDetail.cartInfo.meetingEventEndBookingDate;
        const meetingEventBookingTime = body.eventMeetingRoomBookingInfoDetail.cartInfo.meetingEventBookingTime;
        const meetingEventSeatingArrangement = body.eventMeetingRoomBookingInfoDetail.cartInfo.meetingEventSeatingArrangement;
        const maximumGuestAttending = body.eventMeetingRoomBookingInfoDetail.cartInfo.maximumGuestAttending;
        const wantFoodServices = body.eventMeetingRoomBookingInfoDetail.cartInfo.wantFoodServices;
        const selectedMealsOnBookingDate = body.eventMeetingRoomBookingInfoDetail.cartInfo.selectedMealsOnBookingDate;
        const totalPriceEventMeetingRoom = body.eventMeetingRoomBookingInfoDetail.cartInfo.totalPriceEventMeetingRoom;
        const transactionId = body.transactionId;

        const hotelUser = await HotelCustomersUsers.findById(loginUserId);
        if(hotelUser){
            const newContinousMultipleDatesEventMeetingBookingInfo = new ContinousMultipleDatesBookingInfo({
                customerId,
                transactionId,
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
            await newContinousMultipleDatesEventMeetingBookingInfo.save();
            return NextResponse.json(
                { message: INFORMATION_ADD_TO_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL },
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
        console.log('src/app/api/add-booking/meeting-events/multiple-dates-continous/[userId]/route.js');
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST }