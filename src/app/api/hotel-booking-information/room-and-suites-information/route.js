import { NextRequest, NextResponse } from "next/server";
import rooms from "@/json objects/rooms.js"

function GET(){
    
    return NextResponse.json(
        {rooms}
    );
    
}

export { GET };