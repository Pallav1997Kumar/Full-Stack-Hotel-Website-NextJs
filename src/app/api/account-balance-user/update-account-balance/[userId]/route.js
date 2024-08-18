import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import Connection from "@/database config/config.js";

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
                { message: 'Amount Added to Account Successfully' },
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

export { PATCH }