import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import RoomsSuitesBookingInfo from "@/database models/booking models/room suites models/roomsSuitesBookingInfo.js";

import Connection from "@/database config/config.js";

import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { ROOMS_SUITES_BOOKING_INFO_IS_PRESENT, ROOMS_SUITES_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";

Connection();


async function GET(NextRequest, context){
    try {
        const params = context.params;
        const loginUserIdString = params.userId;
        const loginUserId = new mongoose.Types.ObjectId(loginUserIdString); 

        const currentDate = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const currentIstDate = new Date(currentDate.toLocaleString('en-US', options));

        const hotelUser = await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){

            const roomSuiteUserBooking = await RoomsSuitesBookingInfo.aggregate([
                {
                    $match: {
                        customerId: loginUserId,
                        bookingCheckoutDate: { $lt: currentIstDate }
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

            if(roomSuiteUserBooking){
                
                if(roomSuiteUserBooking.length > 0){
                    return NextResponse.json(
                        { message: ROOMS_SUITES_BOOKING_INFO_IS_PRESENT, roomSuitesBookingInfo: roomSuiteUserBooking },
                        { status: 200 }
                    );
                }

                else{
                    return NextResponse.json(
                        { message: ROOMS_SUITES_BOOKING_INFO_IS_EMPTY },
                        { status: 200 }
                    );
                }
            }
            else{
                return NextResponse.json(
                    { message: ROOMS_SUITES_BOOKING_INFO_IS_EMPTY },
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
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { GET }