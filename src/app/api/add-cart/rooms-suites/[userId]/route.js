import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import RoomsSuitesCartInfo from "@/database models/booking models/room suites models/roomsSuitesCartInfo.js";
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

        const customerCartID = body.roomCartId;
        const bookingRoomTitle = body. roomTitle;
        const bookingCheckinDate = body.checkinDate;
        const bookingCheckoutDate = body.checkoutDate;
        const totalRooms = body.totalRooms;
        const totalGuest = body.totalGuest;
        const guestRoomsDetails = body.guestRoomsDetails;
        const totalPriceOfAllRooms = body.totalPriceOfAllRooms;

        const hotelUser = await HotelCustomersUsers.findById(loginUserId);
        if(hotelUser){
            const newRoomSuitesCartInfo = new RoomsSuitesCartInfo({
                customerId,
                customerCartID,
                bookingRoomTitle,
                bookingCheckinDate,
                bookingCheckoutDate,
                totalRooms,
                totalGuest,
                guestRoomsDetails,
                totalPriceOfAllRooms
            });
            await newRoomSuitesCartInfo.save();
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