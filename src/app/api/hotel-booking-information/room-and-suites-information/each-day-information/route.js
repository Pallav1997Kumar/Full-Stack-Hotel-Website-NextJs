import { NextRequest, NextResponse } from "next/server";

import roomBookingPrice from "@/json objects/booking rates/roomBookingPrice.js";
import { noOfDaysBookingPriceAvailableAfterToday } from "@/json objects/booking rates/roomBookingPrice.js";
import { getOnlyDay } from "@/functions/date.js";


function GET(){
    const roomsWithDate = roomBookingPrice.map(function(eachRoom){
        const currentRoomDetailsObject = {};
        const currentRoomTitle = eachRoom.title;
        const totalRoomEachDay = eachRoom.totalNoOfRooms;
        const dateDetailsArray = getDateDetailsForRoom(totalRoomEachDay, priceForSpecificRoom, currentRoomTitle);
        currentRoomDetailsObject.roomTitle = currentRoomTitle;
        currentRoomDetailsObject.dateDetails = dateDetailsArray;
        return currentRoomDetailsObject;
    });
    
    return NextResponse.json(
        {roomsWithDate}
    );    
}


function priceForSpecificRoom(date, currentRoomTitle){
    const currentRoomDetails = roomBookingPrice.find(function(eachRoom){
        return eachRoom.title == currentRoomTitle;
    });
    const priceList = currentRoomDetails.priceList;
    const dayOfWeek = getOnlyDay(date);
    const dayDetails = priceList.find(function(eachList){
        return eachList.day == dayOfWeek;
    });
    const price = dayDetails.price;
    return price;
}


function getDateDetailsForRoom(totalRoomEachDay, priceForSpecificRoom, currentRoomTitle){
    const dateDetails = [];
    const todayDate = new Date().toISOString().split("T")[0];
    let currentDate = new Date(todayDate);
    const date = new Date(currentDate);
    const price = priceForSpecificRoom(date, currentRoomTitle);
    const totalRoom = totalRoomEachDay;
    const currentDateDetailsObject = {
        date, price, totalRoom
    }
    dateDetails.push(currentDateDetailsObject);

    for (let i = 0; i < noOfDaysBookingPriceAvailableAfterToday; i++) {
        // Increment the date by 1 day
        currentDate.setDate(currentDate.getDate() + 1);
        const date = new Date(currentDate);
        const price = priceForSpecificRoom(date, currentRoomTitle);
        const totalRoom = totalRoomEachDay;
        const currentDateDetailsObject = {
            date, price, totalRoom
        }
        dateDetails.push(currentDateDetailsObject);
    }
    return dateDetails;
}

export { GET };