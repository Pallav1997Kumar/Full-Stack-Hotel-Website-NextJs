import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import SingleDateBookingInfo from "@/database models/booking models/events meetings models/singleDateBookingInfo.js";
import NonContinousMultipleDatesBookingInfo from "@/database models/booking models/events meetings models/nonContinousMultipleDatesBookingInfo.js";
import ContinousMultipleDatesBookingInfo from "@/database models/booking models/events meetings models/continousMultipleDatesBookingInfo.js";

import Connection from "@/database config/config.js";

import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT, EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";

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
            // const eventMeetingSingleDateUserBookingInfo = await SingleDateBookingInfo.find( { customerId: loginUserId, meetingEventBookingDate: { $gte: currentIstDate } } );
            // const eventMeetingMultipleContinousDatesUserBookingInfo = await ContinousMultipleDatesBookingInfo.find( { customerId: loginUserId, meetingEventEndBookingDate: { $gte: currentIstDate } } );
            // const eventMeetingMultipleNonContinousDatesUserBookingInfo1 = await NonContinousMultipleDatesBookingInfo.find( { customerId: loginUserId, 'allDatesBookingInformation.meetingEventBookingDate': { $gte: currentIstDate } } );

            // console.log(eventMeetingMultipleNonContinousDatesUserBookingInfo1);
            // console.log("******************")

            const eventMeetingSingleDateUserBookingInfo = await SingleDateBookingInfo.aggregate([
                {
                    $match: {
                        customerId: loginUserId,
                        meetingEventBookingDate: { $gte: currentIstDate }
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

            const eventMeetingMultipleContinousDatesUserBookingInfo = await ContinousMultipleDatesBookingInfo.aggregate([
                {
                    $match: {
                        customerId: loginUserId,
                        meetingEventEndBookingDate: { $gte: currentIstDate }
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

            const eventMeetingMultipleNonContinousDatesUserBookingInfo = await NonContinousMultipleDatesBookingInfo.aggregate([
                {
                    $match: {
                        customerId: loginUserId,
                        'allDatesBookingInformation.meetingEventBookingDate': { $gte: currentIstDate }
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

            if(eventMeetingSingleDateUserBookingInfo.length == 0 
                && eventMeetingMultipleContinousDatesUserBookingInfo.length == 0
                && eventMeetingMultipleNonContinousDatesUserBookingInfo.length == 0){
                    return NextResponse.json(
                        { message: EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY },
                        { status: 200 }
                    );
            }

            if(eventMeetingMultipleNonContinousDatesUserBookingInfo.length == 0){
                if(eventMeetingSingleDateUserBookingInfo.length > 0 
                    || eventMeetingMultipleContinousDatesUserBookingInfo.length > 0) {
                        const eventMeetingBookingInfo = [
                            ...eventMeetingSingleDateUserBookingInfo,
                            ...eventMeetingMultipleContinousDatesUserBookingInfo
                        ]

                        return NextResponse.json(
                            { message: EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT, eventMeetingBookingInfo },
                            { status: 200 }
                        );
                    }
                
            }
            else if(eventMeetingMultipleNonContinousDatesUserBookingInfo.length > 0){
                if(eventMeetingSingleDateUserBookingInfo.length > 0 
                    || eventMeetingMultipleContinousDatesUserBookingInfo.length > 0) {
                        const eventMeetingBookingInfo = [
                            ...eventMeetingSingleDateUserBookingInfo,
                            ...eventMeetingMultipleContinousDatesUserBookingInfo,
                            ...eventMeetingMultipleNonContinousDatesUserBookingInfo
                        ]

                        return NextResponse.json(
                            { message: EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT, eventMeetingBookingInfo },
                            { status: 200 }
                        );
                    }
            }

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


export { GET }