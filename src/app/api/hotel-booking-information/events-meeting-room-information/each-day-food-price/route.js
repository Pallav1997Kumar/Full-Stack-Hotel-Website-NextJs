import { NextRequest, NextResponse } from "next/server";

import eventMeetingFoodServicePrice from "@/json objects/booking rates/eventMeetingFoodServicePrice.js";
import { noOfDaysFoodServicePriceAvailableAfterToday } from "@/json objects/booking rates/eventMeetingFoodServicePrice.js";
import { getOnlyDay } from "@/functions/date.js";


function GET(){
    const meetingEventFoodPriceWithDate = getDateDetailsWithFoodServicePriceForRooms(eventMeetingFoodServicePrice);

    return NextResponse.json(
        {meetingEventFoodPriceWithDate}
    );

}


function getDateDetailsWithFoodServicePriceForRooms(eventMeetingRoomDayList){
    const dateDetails = [];
    const todayDate = new Date().toISOString().split("T")[0];

    let currentDate = new Date(todayDate);
    const dateToday = new Date(currentDate);
    const dayOfWeekToday = getOnlyDay(dateToday);
    const meetingEventRoomDetailsToday = eventMeetingRoomDayList.find(function(eachDayList){
        return dayOfWeekToday == eachDayList.day;
    });
    const todayMeetingEventTimingListArray = meetingEventRoomDetailsToday.meetingEventTimingList;
    const todayMeetingEventDetailsArray = todayMeetingEventTimingListArray.map(function(eachMeetingEventTiming){
        const meetingEventCurrentTiming = eachMeetingEventTiming.bookingTime;
        const meetingEventCurrentTimingFoodPrice = eachMeetingEventTiming.foodServicePricePerGuest;
        const meetingEventCurrentTimingObject = {
            meetingEventCurrentTiming,
            meetingEventCurrentTimingFoodPrice,
        };
        return meetingEventCurrentTimingObject;
    });
    const todayDateDetails = {
        date: dateToday,
        eventTimingDetails: todayMeetingEventDetailsArray
    };
    dateDetails.push(todayDateDetails);

    for(let i = 0 ; i < noOfDaysFoodServicePriceAvailableAfterToday ; i++){
        //Increment the date by 1 day
        currentDate.setDate(currentDate.getDate() + 1);
        const dateAfterToday = new Date(currentDate);
        const dayOfWeekAfterToday = getOnlyDay(dateAfterToday);
        const meetingEventRoomDetailsAfterToday = eventMeetingRoomDayList.find(function(eachDayList){
            return dayOfWeekAfterToday == eachDayList.day;
        });
        const currentDayMeetingEventTimingListArrayAfterToday = meetingEventRoomDetailsAfterToday.meetingEventTimingList;
        const currentDayMeetingEventDetailsArrayAfterToday = currentDayMeetingEventTimingListArrayAfterToday.map(function(eachMeetingEventTiming){
            const meetingEventCurrentTiming = eachMeetingEventTiming.bookingTime;
            const meetingEventCurrentTimingFoodPrice = eachMeetingEventTiming.foodServicePricePerGuest;
            const meetingEventCurrentTimingObject = {
                meetingEventCurrentTiming,
                meetingEventCurrentTimingFoodPrice,
            };
            return meetingEventCurrentTimingObject;
        });
        const currentDayDateDetailsAfterToday = {
            date: dateAfterToday,
            eventTimingDetails: currentDayMeetingEventDetailsArrayAfterToday
        };
        dateDetails.push(currentDayDateDetailsAfterToday);
    }

    return dateDetails;
}


export { GET };