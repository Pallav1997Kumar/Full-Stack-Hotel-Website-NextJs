import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import DiningCartInfo from "@/database models/booking models/dining models/diningCartInfo.js";

import Connection from "@/database config/config.js";

import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { DINING_PRESENT_IN_CART, DINING_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";


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
                        { message: DINING_PRESENT_IN_CART, diningCartInfo: cartDiningUser },
                        { status: 200 }
                    );
                }
                else{
                    return NextResponse.json(
                        { message: DINING_CART_IS_EMPTY },
                        { status: 200 }
                    );
                }
            }
            else{
                return NextResponse.json(
                    { message: DINING_CART_IS_EMPTY },
                    { status: 200 }
                );
            }
        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { GET }