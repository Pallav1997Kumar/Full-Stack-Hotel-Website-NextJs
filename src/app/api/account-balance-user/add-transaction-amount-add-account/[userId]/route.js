import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import HotelCustomersTransaction from "@/database models/hotelCustomersTransaction.js";
import Connection from "@/database config/config.js";

Connection();


async function POST(NextRequest, context) {
    try{
        const params = context.params;
        const loginUserId = params.userId;
        const body = await NextRequest.json();
        const { amountToBeAdded } = body;
        const hotelUser = await HotelCustomersUsers.findById(loginUserId);
        if(hotelUser){
            const customerId = loginUserId;
            const transactionAmount = amountToBeAdded; 
            const transactionType = 'Money Credited To Account';
            const transactionDescription = 'Money Added To Account By Add Money To Account Option';
            const transactionDateTime = new Date();
            const beforeAccountBalance = hotelUser.accountBalance;
            const updatedAccountBalance = Number(beforeAccountBalance) + Number(amountToBeAdded);
            const newTransactionAmountAdd = new HotelCustomersTransaction({
                customerId,
                transactionAmount,
                transactionType,
                transactionDescription,
                transactionDateTime,
                updatedAccountBalance
            });
            await newTransactionAmountAdd.save();
            return NextResponse.json(
                { message: 'Amount Add Transaction Successfully Added' },
                { status: 200 }
            );
        }
        else{
            return NextResponse.json(
                { errorMessage: 'User not Found!' },
                { status: 404 }
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

export { POST }