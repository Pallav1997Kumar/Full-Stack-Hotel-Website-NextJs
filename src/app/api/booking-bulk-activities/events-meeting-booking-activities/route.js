import { NextRequest, NextResponse } from "next/server";
import Connection from "@/database config/config.js";
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";
import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants.js";
import { 
    INFORMATION_ADD_TO_SINGLE_DATE_EVENT_MEETING_ROOM_SUCCESSFUL,
    INFORMATION_ADD_TO_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL,
    INFORMATION_ADD_TO_NON_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL, 
    SUCCESSFUL_AMOUNT_DEDUCT_EVENT_MEETING_ROOM_TRANSACTION, 
    SUCCESSFUL_AMOUNT_DEDUCTED_FROM_ACCOUNT, 
    EVENT_AND_MEETING_ROOMS_BOOKING_PROCESS_SUCCESSFUL 
} from "@/constant string files/apiSuccessMessageConstants.js";

Connection();


async function POST(NextRequest) {
    try {
        const body = await NextRequest.json();
        const allEventMeetingBookingInfo = body;

        const eventMeetingBookingAmount = allEventMeetingBookingInfo.reduce(function(total, eachEventMeetingBookingInfo){
            return total + (eachEventMeetingBookingInfo.cartInfo.totalPriceEventMeetingRoom || eachEventMeetingBookingInfo.cartInfo.totalPriceOfAllDates || 0);
        }, 0);
        
        const customerId = allEventMeetingBookingInfo[0].cartInfo.customerId;

        const transactionInfo = {
            customerId: customerId,
            deductionAmount: eventMeetingBookingAmount
        };

        const responseEventMeetingRoomTransaction = await fetch(`${process.env.URL}/api/account-balance-user/add-transaction-amount-deduct-account/event-meeting-room-transaction`, {
            method: 'POST',
            body: JSON.stringify(transactionInfo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
        const dataEventMeetingRoomTransaction = await responseEventMeetingRoomTransaction.json();
        
        if (responseEventMeetingRoomTransaction.status !== 200 || dataEventMeetingRoomTransaction.message !== SUCCESSFUL_AMOUNT_DEDUCT_EVENT_MEETING_ROOM_TRANSACTION) {
            return NextResponse.json(
                { errorMessage: dataEventMeetingRoomTransaction.errorMessage }, 
                { status: responseEventMeetingRoomTransaction.status }
            );
        }

        const transactionId = dataEventMeetingRoomTransaction.transactionId;

        for (const eachEventMeetingBookingInfo of allEventMeetingBookingInfo) {
            const eventMeetingRoomBookingInfo = {
                eventMeetingRoomBookingInfoDetail: eachEventMeetingBookingInfo,
                transactionId: transactionId
            };

            if(eachEventMeetingBookingInfo.cartInfo.roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE){

                const responseEventMeetingRoomBooking = await fetch(`${process.env.URL}/api/add-booking/meeting-events/single-date/${customerId}`, {
                    method: 'POST',
                    body: JSON.stringify(eventMeetingRoomBookingInfo),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                });
                const dataEventMeetingRoomBooking = await responseEventMeetingRoomBooking.json();

                if (responseEventMeetingRoomBooking.status !== 200 || dataEventMeetingRoomBooking.message !== INFORMATION_ADD_TO_SINGLE_DATE_EVENT_MEETING_ROOM_SUCCESSFUL) {
                    return NextResponse.json(
                        { errorMessage: dataEventMeetingRoomBooking.errorMessage }, 
                        { status: responseEventMeetingRoomBooking.status }
                    );
                }

                const cartId = eachEventMeetingBookingInfo.cartInfo._id;
                const responseDeleteEventMeetingRoomCartInfo = await fetch(`${process.env.URL}/api/delete-cart/meeting-events/single-date/${cartId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                });
                const dataDeleteEventMeetingRoomCartInfo = await responseDeleteEventMeetingRoomCartInfo.json();

                if (responseDeleteEventMeetingRoomCartInfo.status !== 200) {
                    return NextResponse.json(
                        { errorMessage: dataDeleteEventMeetingRoomCartInfo.errorMessage }, 
                        { status: responseDeleteEventMeetingRoomCartInfo.status }
                    );
                }

            }

            else if(eachEventMeetingBookingInfo.cartInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS){

                const responseEventMeetingRoomBooking = await fetch(`${process.env.URL}/api/add-booking/meeting-events/multiple-dates-continous/${customerId}`, {
                    method: 'POST',
                    body: JSON.stringify(eventMeetingRoomBookingInfo),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                });
                const dataEventMeetingRoomBooking = await responseEventMeetingRoomBooking.json();

                if (responseEventMeetingRoomBooking.status !== 200 || dataEventMeetingRoomBooking.message !== INFORMATION_ADD_TO_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL) {
                    return NextResponse.json(
                        { errorMessage: dataEventMeetingRoomBooking.errorMessage }, 
                        { status: responseEventMeetingRoomBooking.status }
                    );
                }

                const cartId = eachEventMeetingBookingInfo.cartInfo._id;
                const responseDeleteEventMeetingRoomCartInfo = await fetch(`${process.env.URL}/api/delete-cart/meeting-events/multiple-dates-continous/${cartId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                });
                const dataDeleteEventMeetingRoomCartInfo = await responseDeleteEventMeetingRoomCartInfo.json();

                if (responseDeleteEventMeetingRoomCartInfo.status !== 200) {
                    return NextResponse.json(
                        { errorMessage: dataDeleteEventMeetingRoomCartInfo.errorMessage }, 
                        { status: responseDeleteEventMeetingRoomCartInfo.status }
                    );
                }

            }

            else if(eachEventMeetingBookingInfo.cartInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS){

                const responseEventMeetingRoomBooking = await fetch(`${process.env.URL}/api/add-booking/meeting-events/multiple-dates-non-continous/${customerId}`, {
                    method: 'POST',
                    body: JSON.stringify(eventMeetingRoomBookingInfo),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                });
                const dataEventMeetingRoomBooking = await responseEventMeetingRoomBooking.json();

                if (responseEventMeetingRoomBooking.status !== 200 || dataEventMeetingRoomBooking.message !== INFORMATION_ADD_TO_NON_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL) {
                    return NextResponse.json(
                        { errorMessage: dataEventMeetingRoomBooking.errorMessage }, 
                        { status: responseEventMeetingRoomBooking.status }
                    );
                }

                const cartId = eachEventMeetingBookingInfo.cartInfo._id;
                const responseDeleteEventMeetingRoomCartInfo = await fetch(`${process.env.URL}/api/delete-cart/meeting-events/multiple-dates-non-continous/${cartId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                });
                const dataDeleteEventMeetingRoomCartInfo = await responseDeleteEventMeetingRoomCartInfo.json();

                if (responseDeleteEventMeetingRoomCartInfo.status !== 200) {
                    return NextResponse.json(
                        { errorMessage: dataDeleteEventMeetingRoomCartInfo.errorMessage }, 
                        { status: responseDeleteEventMeetingRoomCartInfo.status }
                    );
                }

            }

        }

        const responseDeductMoneyFromAccount = await fetch(`${process.env.URL}/api/account-balance-user/update-account-balance/deduct-money-from-account/${customerId}`, {
            method: 'PATCH',
            body: JSON.stringify(transactionInfo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
        const dataDeductMoneyFromAccount = await responseDeductMoneyFromAccount.json();
        
        if (responseDeductMoneyFromAccount.status !== 200 || dataDeductMoneyFromAccount.message !== SUCCESSFUL_AMOUNT_DEDUCTED_FROM_ACCOUNT) {            
            return NextResponse.json(
                { errorMessage: dataDeductMoneyFromAccount.errorMessage }, 
                { status: responseDeductMoneyFromAccount.status }
            );
        }

        return NextResponse.json(
            { message: EVENT_AND_MEETING_ROOMS_BOOKING_PROCESS_SUCCESSFUL },
            { status: 200 }
        );
    } catch (error) {
        console.error('src/app/api/booking-bulk-activities/events-meeting-booking-activities/route.js', error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST };