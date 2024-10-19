import { NextRequest, NextResponse } from "next/server";
import Connection from "@/database config/config.js";
import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants.js";
import { 
    INFORMATION_ADD_TO_ROOMS_SUITES_BOOKING_SUCCESSFUL, 
    SUCCESSFUL_AMOUNT_DEDUCT_ROOMS_SUITES_TRANSACTION, 
    SUCCESSFUL_AMOUNT_DEDUCTED_FROM_ACCOUNT, 
    ROOMS_SUITES_BOOKING_PROCESS_SUCCESSFUL 
} from "@/constant string files/apiSuccessMessageConstants.js";

Connection();


async function POST(NextRequest) {
    try {
        const body = await NextRequest.json();
        const allRoomSuiteBookingInfo = body;

        const roomsSuitesBookingAmount = allRoomSuiteBookingInfo.reduce(function(total, eachRoomSuiteBookingInfo){
            return total + eachRoomSuiteBookingInfo.cartInfo.totalPriceOfAllRooms;
        }, 0);
        
        const customerId = allRoomSuiteBookingInfo[0].cartInfo.customerId;

        const transactionInfo = {
            customerId: customerId,
            deductionAmount: roomsSuitesBookingAmount
        };

        const responseRoomSuiteTransaction = await fetch(`${process.env.URL}/api/account-balance-user/add-transaction-amount-deduct-account/rooms-suites-transaction`, {
            method: 'POST',
            body: JSON.stringify(transactionInfo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
        const dataRoomSuiteTransaction = await responseRoomSuiteTransaction.json();
        
        if (responseRoomSuiteTransaction.status !== 200 || dataRoomSuiteTransaction.message !== SUCCESSFUL_AMOUNT_DEDUCT_ROOMS_SUITES_TRANSACTION) {
            return NextResponse.json(
                { errorMessage: dataRoomSuiteTransaction.errorMessage }, 
                { status: responseRoomSuiteTransaction.status }
            );
        }

        const transactionId = dataRoomSuiteTransaction.transactionId;

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
            { message: ROOMS_SUITES_BOOKING_PROCESS_SUCCESSFUL },
            { status: 200 }
        );
    } catch (error) {
        console.error('src/app/api/booking-bulk-activities/rooms-suites-booking-activities/route.js', error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST };