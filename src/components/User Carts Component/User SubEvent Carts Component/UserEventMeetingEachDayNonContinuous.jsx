'use client'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import React, { useState } from 'react';

import styles from './UserEventMeetingEachDayNonContinuous.module.css';

import { getDateTextFromFullDate } from "@/functions/date.js";
import { getCommaAndSeperatedArray, getSubarraysOfTwoElements } from "@/functions/array.js";
import { wantFoodServiceConstants, eventMeetingTimingConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '45%',
    width: 1000,
    bgcolor: 'background.paper',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #000',
    p: 2.5
}


function UserEventMeetingEachDayNonContinuous(props){

    const eachBookingDate = props.eachBookingDate;

    const meetingEventBookingTime = eachBookingDate.meetingEventBookingTime;
    const isMorningSlotBooked = meetingEventBookingTime.includes(eventMeetingTimingConstants.MORNING_TIME);
    const isAfternoonSlotBooked = meetingEventBookingTime.includes(eventMeetingTimingConstants.AFTERNOON_TIME);
    const isEveningSlotBooked = meetingEventBookingTime.includes(eventMeetingTimingConstants.EVENING_TIME);
    const isNightSlotBooked = meetingEventBookingTime.includes(eventMeetingTimingConstants.NIGHT_TIME);
    const isMidNightSlotBooked = meetingEventBookingTime.includes(eventMeetingTimingConstants.MID_NIGHT_TIME);

    let morningFoodItems = [];
    let afternoonFoodItems = [];
    let eveningFoodItems = [];
    let nightFoodItems = [];
    let midNightFoodItems = [];

    if(Object.hasOwn(eachBookingDate, 'selectedMealsOnBookingDate')){
        morningFoodItems = eachBookingDate.selectedMealsOnBookingDate.morning;
        afternoonFoodItems = eachBookingDate.selectedMealsOnBookingDate.afternoon;
        eveningFoodItems = eachBookingDate.selectedMealsOnBookingDate.evening;
        nightFoodItems = eachBookingDate.selectedMealsOnBookingDate.night;
        midNightFoodItems = eachBookingDate.selectedMealsOnBookingDate.midNight;
    }

    function getFoodList(foodArrayList){
        const foodArray = foodArrayList.map(function(eachItem){
            return eachItem.split(" (")[0];
        })
        if(foodArray.length == 1){
            return foodArray[0];
        }
        else if(foodArray.length > 1){
            return getCommaAndSeperatedArray(foodArray);
        }
    }

    const [viewDateDetails, setViewDateDetails] = useState(false);


    return (
        <div className={styles.eachDateNumber}>
            <p className={styles.eachDateNumberInformation}>
                <span className={styles.eachDateNumberInformationTitle}>Date: </span>                                            
                {getDateTextFromFullDate(eachBookingDate.meetingEventBookingDate)}
            </p>
            <Button onClick={()=>setViewDateDetails(true)} variant="outlined">
                View Details
            </Button>
            <Modal
                open={viewDateDetails}
                onClose={()=>setViewDateDetails(false)}
            >
                <Box sx={boxStyle}>
                    <div>
                        <p className={styles.eachDateNumberInformationInsideBox}>
                            <span className={styles.eachDateNumberInformationTitle}>Meeting / Event Seating Arrangement: </span>
                            {eachBookingDate.meetingEventSeatingArrangement}
                        </p>
                        {(eachBookingDate.meetingEventBookingTime.length > 1) &&
                            <p className={styles.eachDateNumberInformationInsideBox}>
                                <span className={styles.eachDateNumberInformationTitle}>Meeting / Event Booking Time: </span>
                                {getCommaAndSeperatedArray(eachBookingDate.meetingEventBookingTime)}
                            </p>
                        }
                        {(eachBookingDate.meetingEventBookingTime.length == 1) &&
                            <p className={styles.eachDateNumberInformationInsideBox}>
                                <span className={styles.eachDateNumberInformationTitle}>Meeting / Event Booking Time: </span>
                                {eachBookingDate.meetingEventBookingTime[0]}
                            </p>
                        }
                        <p className={styles.eachDateNumberInformationInsideBox}>
                            <span className={styles.eachDateNumberInformationTitle}>Number of Guests Attending: </span>
                            {eachBookingDate.maximumGuestAttending}
                        </p>
                        <p className={styles.eachDateNumberInformationInsideBox}>
                            <span className={styles.eachDateNumberInformationTitle}>Food Services Included: </span>
                            {eachBookingDate.wantFoodServices}
                        </p>
                        <p className={styles.eachDateNumberInformationInsideBox}>
                            <span className={styles.eachDateNumberInformationTitle}>Price of Event/Meeting Room: </span>
                            {CURRENCY_SYMBOL}{eachBookingDate.totalPriceEventMeetingRoom}
                        </p>
                        {(eachBookingDate.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && Object.hasOwn(eachBookingDate,'selectedMealsOnBookingDate')) &&
                            <div>
                                {isMorningSlotBooked &&
                                    <div className={styles.eachSlot}>
                                        <span className={styles.eachSlotTitle}>Morning Food Items: </span>
                                        {(morningFoodItems.length == 0) && <span>N/A</span>}
                                        {(morningFoodItems.length > 0) && getFoodList(morningFoodItems)}
                                    </div>
                                }
                                {isAfternoonSlotBooked &&
                                    <div className={styles.eachSlot}>
                                        <span className={styles.eachSlotTitle}>Afternoon Food Items: </span>
                                        {(afternoonFoodItems.length == 0) && <span>N/A</span>}
                                        {(afternoonFoodItems.length > 0) && getFoodList(afternoonFoodItems)}
                                    </div>
                                }
                                {isEveningSlotBooked &&
                                    <div className={styles.eachSlot}>
                                        <span className={styles.eachSlotTitle}>Evening Food Items: </span>
                                        {(eveningFoodItems.length == 0) && <span>N/A</span>}
                                        {(eveningFoodItems.length > 0) && getFoodList(eveningFoodItems)}
                                    </div>
                                }
                                {isNightSlotBooked &&
                                    <div className={styles.eachSlot}>
                                        <span className={styles.eachSlotTitle}>Night Food Items: </span>
                                        {(nightFoodItems.length == 0) && <span>N/A</span>}
                                        {(nightFoodItems.length > 0) && getFoodList(nightFoodItems)}
                                    </div>
                                }
                                {isMidNightSlotBooked &&
                                    <div className={styles.eachSlot}>
                                        <span className={styles.eachSlotTitle}>Mid Night Food Items: </span>
                                        {(midNightFoodItems.length == 0) && <span>N/A</span>}
                                        {(midNightFoodItems.length > 0) && getFoodList(midNightFoodItems)}
                                    </div>
                                }
                            </div>
                        }
                        <Button onClick={()=>setViewDateDetails(false)} variant="outlined">
                            Ok
                        </Button>
                    </div>
                </Box>                                    
            </Modal>                                
        </div>
    );
}

export default UserEventMeetingEachDayNonContinuous;