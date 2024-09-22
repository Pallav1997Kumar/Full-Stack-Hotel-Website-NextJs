import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import RoomsSuitesCartInfo from "@/database models/booking models/room suites models/roomsSuitesCartInfo.js";

import Connection from "@/database config/config.js";

import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { ROOMS_SUITES_PRESENT_IN_CART, ROOMS_SUITES_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";

Connection();


async function GET(NextRequest, context){
    try {
        const params = context.params;
        const loginUserId = params.userId;

        const hotelUser = await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const cartRoomSuiteUser = await RoomsSuitesCartInfo.find( { customerId: loginUserId } );

            if(cartRoomSuiteUser){
                
                if(cartRoomSuiteUser.length > 0){
                    return NextResponse.json(
                        { message: ROOMS_SUITES_PRESENT_IN_CART, roomSuiteCartInfo: cartRoomSuiteUser },
                        { status: 200 }
                    );
                }

                else{
                    return NextResponse.json(
                        { message: ROOMS_SUITES_CART_IS_EMPTY },
                        { status: 200 }
                    );
                }
            }
            else{
                return NextResponse.json(
                    { message: ROOMS_SUITES_CART_IS_EMPTY },
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
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { GET }