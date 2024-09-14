import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import HotelCustomersTransaction from "@/database models/hotelCustomersTransaction.js";
import Connection from "@/database config/config.js";
import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { SUCCESSFUL_AMOUNT_ADD_TRANSACTION } from "@/constant string files/apiSuccessMessageConstants.js";

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
                { message: SUCCESSFUL_AMOUNT_ADD_TRANSACTION },
                { status: 200 }
            );
        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
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

export { POST }