import { NextRequest, NextResponse } from "next/server";

import meetingEventsRoomBookingBasicPrice from "@/json objects/booking rates/meetingEventsRoomBookingBasicPrice.js";
import { noOfDaysBookingPriceAvailableAfterToday } from "@/json objects/booking rates/meetingEventsRoomBookingBasicPrice.js";
import { getOnlyDay } from "@/functions/date.js";


function GET(){

    const meetingEventDetailsWithDate = meetingEventsRoomBookingBasicPrice.map(function(eachMeetingEventsRooms){
        const currentMeetingEventsRoomsDetailsObject = {};
        const currentMeetingEventAreaTitle = eachMeetingEventsRooms.meetingEventAreaTitle;
        const currentMeetingEventTotalRooms = eachMeetingEventsRooms.totalNoOfRoom;
        const currentMeetingEventDayList = eachMeetingEventsRooms.dayList;
        const dateDetailsForCurrentMeetingEventsRoom = getDateDetailsForCurrentMeetingEventsRoom(currentMeetingEventDayList, currentMeetingEventTotalRooms);

        currentMeetingEventsRoomsDetailsObject.diningTitle = currentMeetingEventAreaTitle;
        currentMeetingEventsRoomsDetailsObject.dateDetails = dateDetailsForCurrentMeetingEventsRoom;

        return currentMeetingEventsRoomsDetailsObject;
    });
    
    return NextResponse.json(
        {meetingEventDetailsWithDate}
    );
    
}


function getDateDetailsForCurrentMeetingEventsRoom(currentEventMeetingRoomDayList, totalNoOfRooms){
    const dateDetails = [];
    const todayDate = new Date().toISOString().split("T")[0];

    let currentDate = new Date(todayDate);
    const dateToday = new Date(currentDate);
    const dayOfWeekToday = getOnlyDay(dateToday);
    const meetingEventRoomDetailsToday = currentEventMeetingRoomDayList.find(function(eachDayList){
        return dayOfWeekToday == eachDayList.day;
    });
    const todayMeetingEventTimingListArray = meetingEventRoomDetailsToday.meetingEventTimingList;
    const todayMeetingEventDetailsArray = todayMeetingEventTimingListArray.map(function(eachMeetingEventTiming){
        const currentMeetingEventTiming = eachMeetingEventTiming.bookingTime;
        const currentMeetingEventTimingBasicPrice = eachMeetingEventTiming.basicPrice;
        const currentMeetingEventTimingObject = {
            currentMeetingEventTiming,
            currentMeetingEventTimingBasicPrice,
            totalNoOfRooms
        };
        return currentMeetingEventTimingObject;
    });
    const todayDateDetails = {
        date: dateToday,
        eventTimingDetails: todayMeetingEventDetailsArray
    };
    dateDetails.push(todayDateDetails);

    for(let i = 0 ; i < noOfDaysBookingPriceAvailableAfterToday ; i++){
        //Increment the date by 1 day
        currentDate.setDate(currentDate.getDate() + 1);
        const dateAfterToday = new Date(currentDate);
        const dayOfWeekAfterToday = getOnlyDay(dateAfterToday);
        const meetingEventRoomDetailsAfterToday = currentEventMeetingRoomDayList.find(function(eachDayList){
            return dayOfWeekAfterToday == eachDayList.day;
        });
        const currentDayMeetingEventTimingListArrayAfterToday = meetingEventRoomDetailsAfterToday.meetingEventTimingList;
        const currentDayMeetingEventDetailsArrayAfterToday = currentDayMeetingEventTimingListArrayAfterToday.map(function(eachMeetingEventTiming){
            const currentMeetingEventTiming = eachMeetingEventTiming.bookingTime;
            const currentMeetingEventTimingBasicPrice = eachMeetingEventTiming.basicPrice;
            const currentMeetingEventTimingObject = {
                currentMeetingEventTiming,
                currentMeetingEventTimingBasicPrice,
                totalNoOfRooms
            };
            return currentMeetingEventTimingObject;
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