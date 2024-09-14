import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import DiningCartInfo from "@/database models/booking models/dining models/diningCartInfo.js";
import Connection from "@/database config/config.js";
import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { INFORMATION_ADD_TO_CART_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";

Connection();

async function POST(NextRequest, context){
    try {
        const params = context.params;
        const loginUserId = params.userId;
        const customerId = loginUserId;
        const body = await NextRequest.json();
        
        const diningCartId = body.diningCartId;
        const diningRestaurantTitle = body.diningRestaurantTitle;
        const tableBookingDate = body.tableBookingDate;
        const noOfGuests = body.noOfGuests;
        const mealType = body.mealType;
        const tableBookingTime = body.tableBookingTime;
        const tableBookingCountDetails = body.tableBookingCountDetails;
        const priceForBooking = body.priceForBooking;

        const hotelUser = await HotelCustomersUsers.findById(loginUserId);
        if(hotelUser){
            const newDiningCartInfo = new DiningCartInfo({
                customerId,
                diningCartId,
                diningRestaurantTitle,
                tableBookingDate,
                noOfGuests,
                mealType,
                tableBookingTime,
                tableBookingCountDetails,
                priceForBooking
            });
            await newDiningCartInfo.save();
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
    } catch (error) {
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST }