import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import RoomsSuitesCartInfo from "@/database models/booking models/room suites models/roomsSuitesCartInfo.js";

import Connection from "@/database config/config.js";

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
                        { message: 'Rooms and Suites Present in Cart!', roomSuiteCartInfo: cartRoomSuiteUser },
                        { status: 200 }
                    );
                }

                else{
                    return NextResponse.json(
                        { message: 'Rooms and Suites Cart is Empty!' },
                        { status: 200 }
                    );
                }
            }
            else{
                return NextResponse.json(
                    { message: 'Rooms and Suites Cart is Empty!' },
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
        console.log(error);
        return NextResponse.json(
            { errorMessage: 'Internal Server Error' }, 
            { status: 500 }
        );
    }
}


export { GET }