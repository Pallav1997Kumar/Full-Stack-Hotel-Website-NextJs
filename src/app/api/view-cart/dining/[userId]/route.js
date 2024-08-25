import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import DiningCartInfo from "@/database models/booking models/dining models/diningCartInfo.js";

import Connection from "@/database config/config.js";

Connection();


async function GET(NextRequest, context){
    try {
        const params = context.params;
        const loginUserId = params.userId;

        const hotelUser = await HotelCustomersUsers.findById(loginUserId);
        if(hotelUser){
            const cartDiningUser = await DiningCartInfo.find( { customerId: loginUserId } );
            if(cartDiningUser){
                if(cartDiningUser.length > 0){
                    return NextResponse.json(
                        { message: 'Dining Present in Cart!', diningCartInfo: cartDiningUser },
                        { status: 200 }
                    );
                }
                else{
                    return NextResponse.json(
                        { message: 'Dining Cart is Empty!' },
                        { status: 200 }
                    );
                }
            }
            else{
                return NextResponse.json(
                    { message: 'Dining Cart is Empty!' },
                    { status: 200 }
                );
            }
        }
        else{
            return NextResponse.json(
                { errorMessage: 'User not Found!' },
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { errorMessage: 'Internal Server Error' }, 
            { status: 500 }
        );
    }
}


export { GET }