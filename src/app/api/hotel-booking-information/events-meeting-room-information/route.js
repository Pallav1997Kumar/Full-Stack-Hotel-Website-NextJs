import { NextRequest, NextResponse } from "next/server";
import meetingEventsRooms from "@/json objects/meetingEventsRooms.js"

function GET(){
    
    return NextResponse.json(
        {meetingEventsRooms}
    );
    
}

export { GET };