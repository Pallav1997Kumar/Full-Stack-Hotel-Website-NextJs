import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import RoomsSuitesCartInfo from "@/database models/booking models/room suites models/roomsSuitesCartInfo.js";

import Connection from "@/database config/config.js";

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