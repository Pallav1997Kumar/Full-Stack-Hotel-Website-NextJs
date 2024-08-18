import { NextRequest, NextResponse } from "next/server";
import dining from "@/json objects/dining.js"

function GET(){
    
    return NextResponse.json(
        {dining}
    );
    
}

export { GET };