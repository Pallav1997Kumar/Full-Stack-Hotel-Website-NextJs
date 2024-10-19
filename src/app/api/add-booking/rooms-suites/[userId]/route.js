import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import RoomsSuitesBookingInfo from "@/database models/booking models/room suites models/roomsSuitesBookingInfo.js";
import Connection from "@/database config/config.js";
import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { INFORMATION_ADD_TO_ROOMS_SUITES_BOOKING_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";


Connection();

async function POST(NextRequest, context){
    try{
        const params = context.params;
        const loginUserId = params.userId;
        const customerId = loginUserId;
        const body = await NextRequest.json();

        const bookingRoomTitle = body.roomSuiteBookingInfoDetail.cartInfo.bookingRoomTitle;
        const bookingCheckinDate = body.roomSuiteBookingInfoDetail.cartInfo.bookingCheckinDate;
        const bookingCheckoutDate = body.roomSuiteBookingInfoDetail.cartInfo.bookingCheckoutDate;
        const totalRooms = body.roomSuiteBookingInfoDetail.cartInfo.totalRooms;
        const totalGuest = body.roomSuiteBookingInfoDetail.cartInfo.totalGuest;
        const guestRoomsDetails = body.roomSuiteBookingInfoDetail.cartInfo.guestRoomsDetails;
        const totalPriceOfAllRooms = body.roomSuiteBookingInfoDetail.cartInfo.totalPriceOfAllRooms;
        const transactionId = body.transactionId;  

        const hotelUser = await HotelCustomersUsers.findById(loginUserId);
        if(hotelUser){
            const newRoomSuitesBookingInfo = new RoomsSuitesBookingInfo({
                customerId,
                transactionId,
                bookingRoomTitle,
                bookingCheckinDate,
                bookingCheckoutDate,
                totalRooms,
                totalGuest,
                guestRoomsDetails,
                totalPriceOfAllRooms
            });
            console.log(newRoomSuitesBookingInfo);
            await newRoomSuitesBookingInfo.save();
            return NextResponse.json(
                { message: INFORMATION_ADD_TO_ROOMS_SUITES_BOOKING_SUCCESSFUL },
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
        console.log('src/app/api/add-booking/rooms-suites/[userId]/route.js');
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST }