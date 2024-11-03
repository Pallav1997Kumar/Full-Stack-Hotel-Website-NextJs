import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import DiningBookingInfo from "@/database models/booking models/dining models/diningBookingInfo.js";

import Connection from "@/database config/config.js";

import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { DINING_BOOKING_INFO_IS_PRESENT, DINING_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";


Connection();


async function GET(NextRequest, context){
    try {
        const params = context.params;
        const loginUserIdString = params.userId;
        const loginUserId = new mongoose.Types.ObjectId(loginUserIdString); 

        const hotelUser = await HotelCustomersUsers.findById(loginUserId);
        
        const currentDate = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const currentIstDate = new Date(currentDate.toLocaleString('en-US', options));

        if(hotelUser){
            
            const bookingDiningUser = await DiningBookingInfo.aggregate([
                {
                    $match: {
                        customerId: loginUserId,
                        tableBookingDate: { $gte: currentIstDate }
                    }
                },
                {
                    $lookup: {
                        from: 'hotelcustomerstransactions', // Ensure this matches the collection name in the database
                        localField: 'transactionId',
                        foreignField: '_id',
                        as: 'transactionDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$transactionDetails',
                        preserveNullAndEmptyArrays: true // Optional, if you want to keep bookings without transactions
                    }
                },
                {
                    $project: {
                        bookingInfo: "$$ROOT",
                        'transactionDetails._id': 1,
                        'transactionDetails.transactionAmount': 1,
                        'transactionDetails.transactionType': 1,
                        'transactionDetails.transactionDescription': 1,
                        'transactionDetails.transactionDateTime': 1,
                    }
                }
            ]);
    
            
            if(bookingDiningUser){
                if(bookingDiningUser.length > 0){
                    return NextResponse.json(
                        { message: DINING_BOOKING_INFO_IS_PRESENT, diningBookingInfo: bookingDiningUser },
                        { status: 200 }
                    );
                }
                else{
                    return NextResponse.json(
                        { message: DINING_BOOKING_INFO_IS_EMPTY },
                        { status: 200 }
                    );
                }
            }
            else{
                return NextResponse.json(
                    { message: DINING_BOOKING_INFO_IS_EMPTY },
                    { status: 200 }
                );
            }
        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
            );
        }
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { GET }