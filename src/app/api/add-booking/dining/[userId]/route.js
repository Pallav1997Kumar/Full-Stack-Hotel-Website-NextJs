import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import DiningBookingInfo from "@/database models/booking models/dining models/diningBookingInfo.js";
import Connection from "@/database config/config.js";
import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { INFORMATION_ADD_TO_DINING_BOOKING_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";

Connection();

async function POST(NextRequest, context){
    try {
        const params = context.params;
        const loginUserId = params.userId;
        const customerId = loginUserId;
        const body = await NextRequest.json();
        
        const diningRestaurantTitle = body.diningBookingInfoDetail.cartInfo.diningRestaurantTitle;
        const tableBookingDate = body.diningBookingInfoDetail.cartInfo.tableBookingDate;
        const noOfGuests = body.diningBookingInfoDetail.cartInfo.noOfGuests;
        const mealType = body.diningBookingInfoDetail.cartInfo.mealType;
        const tableBookingTime = body.diningBookingInfoDetail.cartInfo.tableBookingTime;
        const tableBookingCountDetails = body.diningBookingInfoDetail.cartInfo.tableBookingCountDetails;
        const priceForBooking = body.diningBookingInfoDetail.cartInfo.priceForBooking;
        const transactionId = body.transactionId;      

        const hotelUser = await HotelCustomersUsers.findById(loginUserId);
        if(hotelUser){
            const newDiningBookingInfo = new DiningBookingInfo({
                customerId,
                transactionId,
                diningRestaurantTitle,
                tableBookingDate,
                noOfGuests,
                mealType,
                tableBookingTime,
                tableBookingCountDetails,
                priceForBooking
            });
            await newDiningBookingInfo.save();
            return NextResponse.json(
                { message: INFORMATION_ADD_TO_DINING_BOOKING_SUCCESSFUL },
                { status: 200 }
            );
        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
            );
        }
    } catch (error) {
        console.log('src/app/api/add-booking/dining/[userId]/route.js');
        console.log(error)
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST }