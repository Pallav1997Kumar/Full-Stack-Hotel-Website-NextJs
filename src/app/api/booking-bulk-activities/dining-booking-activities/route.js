import { NextRequest, NextResponse } from "next/server";
import Connection from "@/database config/config.js";
import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants.js";
import { 
    INFORMATION_ADD_TO_DINING_BOOKING_SUCCESSFUL, 
    SUCCESSFUL_AMOUNT_DEDUCT_DINING_TRANSACTION, 
    SUCCESSFUL_AMOUNT_DEDUCTED_FROM_ACCOUNT, 
    DINING_BOOKING_PROCESS_SUCCESSFUL 
} from "@/constant string files/apiSuccessMessageConstants.js";

Connection();

async function POST(NextRequest) {
    try {
        const body = await NextRequest.json();
        const allDiningBookingInfo = body;

        const diningBookingAmount = allDiningBookingInfo.reduce(function(total, eachDiningBookingInfo) {
            return total + eachDiningBookingInfo.cartInfo.priceForBooking;
        }, 0);
        
        const customerId = allDiningBookingInfo[0].cartInfo.customerId;

        const transactionInfo = {
            customerId: customerId,
            deductionAmount: diningBookingAmount
        };

        const responseDiningTransaction = await fetch(`${process.env.URL}/api/account-balance-user/add-transaction-amount-deduct-account/dining-transaction`, {
            method: 'POST',
            body: JSON.stringify(transactionInfo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
        const dataDiningTransaction = await responseDiningTransaction.json();
        
        if (responseDiningTransaction.status !== 200 || dataDiningTransaction.message !== SUCCESSFUL_AMOUNT_DEDUCT_DINING_TRANSACTION) {
            return NextResponse.json(
                { errorMessage: dataDiningTransaction.errorMessage }, 
                { status: responseDiningTransaction.status }
            );
        }

        const transactionId = dataDiningTransaction.transactionId;

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
            { message: DINING_BOOKING_PROCESS_SUCCESSFUL },
            { status: 200 }
        );
    } catch (error) {
        console.error('src/app/api/booking-bulk-activities/dining-booking-activities/route.js', error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST };