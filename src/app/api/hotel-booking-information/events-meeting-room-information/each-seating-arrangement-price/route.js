import { NextRequest, NextResponse } from "next/server";

import eventMeetingPriceForSeatingArrangement from "@/json objects/booking rates/seatingArrangementPrice.js";


function GET(){   
    return NextResponse.json(
        {eventMeetingPriceForSeatingArrangement}
    );
}


export { GET };