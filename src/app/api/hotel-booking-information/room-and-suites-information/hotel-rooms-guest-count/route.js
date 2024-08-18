import { NextRequest, NextResponse } from "next/server";
import roomsGuestInfo from "@/json objects/roomsGuestInfo.js"

function GET(){
    
    return NextResponse.json(
        {roomsGuestInfo}
    );
    
}

export { GET };