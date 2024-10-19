import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import Connection from "@/database config/config.js";
import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { SUCCESSFUL_AMOUNT_ADD_TO_ACCOUNT } from "@/constant string files/apiSuccessMessageConstants.js";


Connection();

async function PATCH(NextRequest, context){
    try{
        const params = context.params;
        const loginUserId = params.userId;
        const body = await NextRequest.json();
        const { amountToBeAdded } = body;
        const hotelUser = await HotelCustomersUsers.findById(loginUserId);
        if(hotelUser){
            const beforeAccountBalance = hotelUser.accountBalance;
            const updatedAccountBalance = Number(beforeAccountBalance) + Number(amountToBeAdded);
            const updatedInfo = {
                accountBalance: updatedAccountBalance
            }
            const updatedHotelUser = await HotelCustomersUsers.findByIdAndUpdate(loginUserId, {
                $set: updatedInfo
            });
            return NextResponse.json(
                { message: SUCCESSFUL_AMOUNT_ADD_TO_ACCOUNT },
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

export { PATCH }