import { NextRequest, NextResponse } from 'next/server';
import HotelCustomersTransaction from "@/database models/hotelCustomersTransaction.js";
import Connection from "@/database config/config.js";
import { INTERNAL_SERVER_ERROR } from "@/constant string files/apiErrorMessageConstants.js";
import { TRANSACTION_HISTORY_FOUND, NO_TRANSACTION_HISTORY_FOUND } from "@/constant string files/apiSuccessMessageConstants.js";


Connection();

async function GET(NextRequest, context){
    try{
        const params = context.params;
        const loginUserId = params.userId;
        const userTransactionHistory = await HotelCustomersTransaction.find( { customerId: loginUserId } );
        console.log(userTransactionHistory);
        
        if(userTransactionHistory){
            if(userTransactionHistory.length > 0){
                return NextResponse.json(
                    { message: TRANSACTION_HISTORY_FOUND, transactionHistory: userTransactionHistory},
                    { status: 200 }
                );
            }
            else{
                return NextResponse.json(
                    { message: NO_TRANSACTION_HISTORY_FOUND },
                    { status: 200 }
                );
            }
        }
        else{
            return NextResponse.json(
                { message: NO_TRANSACTION_HISTORY_FOUND },
                { status: 200 }
            );
        }
    }
    catch(error){
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { GET }