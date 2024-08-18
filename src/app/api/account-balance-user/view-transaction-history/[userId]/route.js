import { NextRequest, NextResponse } from 'next/server';
import HotelCustomersTransaction from "@/database models/hotelCustomersTransaction.js";
import Connection from "@/database config/config.js";

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
                    { message: 'Transaction History', transactionHistory: userTransactionHistory},
                    { status: 200 }
                );
            }
            else{
                return NextResponse.json(
                    { message: 'No Tansacation History Found' },
                    { status: 200 }
                );
            }
        }
        else{
            return NextResponse.json(
                { message: 'No Tansacation History Found' },
                { status: 200 }
            );
        }
    }
    catch(error){
        return NextResponse.json(
            { errorMessage: 'Internal Server Error' }, 
            { status: 500 }
        );
    }
}

export { GET }