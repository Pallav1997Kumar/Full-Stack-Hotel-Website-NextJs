import { NextRequest, NextResponse } from "next/server";
import Connection from "@/database config/config.js";
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";
import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants.js";
import { 
    INFORMATION_ADD_TO_DINING_BOOKING_SUCCESSFUL, 
    INFORMATION_ADD_TO_ROOMS_SUITES_BOOKING_SUCCESSFUL,
    INFORMATION_ADD_TO_SINGLE_DATE_EVENT_MEETING_ROOM_SUCCESSFUL,
    INFORMATION_ADD_TO_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL,
    INFORMATION_ADD_TO_NON_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL,
    SUCCESSFUL_AMOUNT_DEDUCT_ROOMS_SUITES_DINING_EVENT_MEETING_ROOM_TRANSACTION, 
    SUCCESSFUL_AMOUNT_DEDUCTED_FROM_ACCOUNT, 
    ROOMS_SUITES_DINING_EVENT_MEETING_ROOM_BOOKING_PROCESS_SUCCESSFUL 
} from "@/constant string files/apiSuccessMessageConstants.js";


async function POST(NextRequest) {
    try{
        const body = await NextRequest.json();
        const allDiningBookingInfo = body.allDiningBookingInfo;
        const allEventMeetingBookingInfo = body.allEventMeetingBookingInfo;
        const allRoomSuiteBookingInfo = body.allRoomSuiteBookingInfo;

        let diningBookingAmount = 0;
        let eventMeetingBookingAmount = 0;
        let roomsSuitesBookingAmount = 0;

        if(allDiningBookingInfo.length > 0){
            diningBookingAmount = allDiningBookingInfo.reduce(function(total, eachDiningBookingInfo) {
                return total + eachDiningBookingInfo.cartInfo.priceForBooking;
            }, 0);
        }
        if(allEventMeetingBookingInfo.length > 0){
            eventMeetingBookingAmount = allEventMeetingBookingInfo.reduce(function(total, eachEventMeetingBookingInfo){
                return total + (eachEventMeetingBookingInfo.cartInfo.totalPriceEventMeetingRoom || eachEventMeetingBookingInfo.cartInfo.totalPriceOfAllDates || 0);
            }, 0);
        }
        if(allRoomSuiteBookingInfo.length > 0){
            roomsSuitesBookingAmount = allRoomSuiteBookingInfo.reduce(function(total, eachRoomSuiteBookingInfo){
                return total + eachRoomSuiteBookingInfo.cartInfo.totalPriceOfAllRooms;
            }, 0);
        }

        const allComponentTotalBookingAmount = diningBookingAmount + eventMeetingBookingAmount + roomsSuitesBookingAmount;

        let customerId = null;

        if(allDiningBookingInfo.length > 0){
            customerId = allDiningBookingInfo[0].cartInfo.customerId;
        }
        else if(allEventMeetingBookingInfo.length > 0){
            customerId = allEventMeetingBookingInfo[0].cartInfo.customerId;
        }
        else if(allRoomSuiteBookingInfo.length > 0){
            customerId = allRoomSuiteBookingInfo[0].cartInfo.customerId;
        }

        const transactionInfo = {
            customerId: customerId,
            deductionAmount: allComponentTotalBookingAmount
        };

        const responseAllComponentTransaction = await fetch(`${process.env.URL}/api/account-balance-user/add-transaction-amount-deduct-account/all-types-transaction`, {
            method: 'POST',
            body: JSON.stringify(transactionInfo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
        const dataAllComponentTransaction = await responseAllComponentTransaction.json();

        if (responseAllComponentTransaction.status !== 200 || dataAllComponentTransaction.message !== SUCCESSFUL_AMOUNT_DEDUCT_ROOMS_SUITES_DINING_EVENT_MEETING_ROOM_TRANSACTION) {
            return NextResponse.json(
                { errorMessage: dataAllComponentTransaction.errorMessage }, 
                { status: responseAllComponentTransaction.status }
            );
        }

        const transactionId = dataAllComponentTransaction.transactionId;

        if(allDiningBookingInfo.length > 0){
            for (const eachDiningBookingInfo of allDiningBookingInfo) {
                const diningBookingInfo = {
                    diningBookingInfoDetail: eachDiningBookingInfo,
                    transactionId: transactionId
                };
                
                const responseDiningBooking = await fetch(`${process.env.URL}/api/add-booking/dining/${customerId}`, {
                    method: 'POST',
                    body: JSON.stringify(diningBookingInfo),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                });
                const dataDiningBooking = await responseDiningBooking.json();
                
                if (responseDiningBooking.status !== 200 || dataDiningBooking.message !== INFORMATION_ADD_TO_DINING_BOOKING_SUCCESSFUL) {
                    return NextResponse.json(
                        { errorMessage: dataDiningBooking.errorMessage }, 
                        { status: responseDiningBooking.status }
                    );
                }
    
                const cartId = eachDiningBookingInfo.cartInfo._id;
                const responseDeleteDiningCartInfo = await fetch(`${process.env.URL}/api/delete-cart/dining/${cartId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                });
                const dataDeleteDiningCartInfo = await responseDeleteDiningCartInfo.json();
                
                if (responseDeleteDiningCartInfo.status !== 200) {
                    return NextResponse.json(
                        { errorMessage: dataDeleteDiningCartInfo.errorMessage }, 
                        { status: responseDeleteDiningCartInfo.status }
                    );
                }
            }
        }

        if(allRoomSuiteBookingInfo.length > 0){
            for (const eachRoomSuiteBookingInfo of allRoomSuiteBookingInfo) {
                const roomSuiteBookingInfo = {
                    roomSuiteBookingInfoDetail: eachRoomSuiteBookingInfo,
                    transactionId: transactionId
                };
    
                const responseRoomSuiteBooking = await fetch(`${process.env.URL}/api/add-booking/rooms-suites/${customerId}`, {
                    method: 'POST',
                    body: JSON.stringify(roomSuiteBookingInfo),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                });
                const dataRoomSuiteBooking = await responseRoomSuiteBooking.json();
                
                if (responseRoomSuiteBooking.status !== 200 || dataRoomSuiteBooking.message !== INFORMATION_ADD_TO_ROOMS_SUITES_BOOKING_SUCCESSFUL) {
                    return NextResponse.json(
                        { errorMessage: dataRoomSuiteBooking.errorMessage }, 
                        { status: responseRoomSuiteBooking.status }
                    );
                }
    
                const cartId = eachRoomSuiteBookingInfo.cartInfo._id;
                const responseDeleteRoomSuiteCartInfo = await fetch(`${process.env.URL}/api/delete-cart/rooms-suites/${cartId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                });
                const dataDeleteRoomSuiteCartInfo = await responseDeleteRoomSuiteCartInfo.json();
                
                if (responseDeleteRoomSuiteCartInfo.status !== 200) {
                    return NextResponse.json(
                        { errorMessage: dataDeleteRoomSuiteCartInfo.errorMessage }, 
                        { status: responseDeleteRoomSuiteCartInfo.status }
                    );
                }
            }
        }

        if(allEventMeetingBookingInfo.length > 0){
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
            { message: ROOMS_SUITES_DINING_EVENT_MEETING_ROOM_BOOKING_PROCESS_SUCCESSFUL },
            { status: 200 }
        );

    }
    catch (error) {
        console.error('src/app/api/booking-bulk-activities/all-types-booking-activities/route.js', error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST };