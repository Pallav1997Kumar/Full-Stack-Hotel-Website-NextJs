'use client'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import React, { useState } from 'react';

import styles from './EventMeetingSingleDateBookingInfo.module.css';

import { getDateTextFromFullDate } from "@/functions/date.js";
import { getCommaAndSeperatedArray, getSubarraysOfTwoElements } from "@/functions/array.js";
import { wantFoodServiceConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";
import EventMeetingFoodServices from "./Food Services Of Event/EventMeetingFoodServices.jsx";


const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 1000,
    bgcolor: 'background.paper',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #000',
    p: 2.5
}


function EventMeetingSingleDateBookingInfo(props){

    const eachEventMeetingBookingInfo = props.eachEventMeetingBookingInfo;
    const transactionDetails = props.transactionDetails;

    const [viewFoodItems, setViewFoodItems] = useState(false);

    return (
        <div className={styles.eachEventMeetingBookingtInformation}>
            <p className={styles.eachEventMeetingTitle}>
                Meeting / Event Area Name: {eachEventMeetingBookingInfo.meetingEventsInfoTitle}
            </p>
           {transactionDetails &&
                <p className={styles.eventMeetingBookingEachInfo}>
                    <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Meeting / Event Booked On Date: </span>
                    {getDateTextFromFullDate(transactionDetails.transactionDateTime)}
                </p>
            }
            <p className={styles.eventMeetingBookingEachInfo}>
                <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Meeting / Event Booking Date: </span>
                {getDateTextFromFullDate(eachEventMeetingBookingInfo.meetingEventBookingDate)}
            </p>
            {(eachEventMeetingBookingInfo.meetingEventBookingTime.length > 1) &&
                <p className={styles.eventMeetingBookingEachInfo}>
                    <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Meeting / Event Booking Time: </span>
                    {getCommaAndSeperatedArray(eachEventMeetingBookingInfo.meetingEventBookingTime)}
                </p>
            }
            {(eachEventMeetingBookingInfo.meetingEventBookingTime.length == 1) &&
                <p className={styles.eventMeetingBookingEachInfo}>
                    <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Meeting / Event Booking Time: </span>
                    {eachEventMeetingBookingInfo.meetingEventBookingTime[0]}
                </p>
            }
            <p className={styles.eventMeetingBookingEachInfo}>
                <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Meeting / Event Seating Arrangement: </span>
                {eachEventMeetingBookingInfo.meetingEventSeatingArrangement}
            </p>
            <p className={styles.eventMeetingBookingEachInfo}>
                <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Number of Guests Attending: </span>
                {eachEventMeetingBookingInfo.maximumGuestAttending}
            </p>
            <p className={styles.eventMeetingBookingEachInfo}>
                <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Food Services Included: </span>
                {eachEventMeetingBookingInfo.wantFoodServices}
            </p>
            <p className={styles.eventMeetingBookingEachInfo}>
                <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Total Price of Event/Meeting Room: </span>
                {CURRENCY_SYMBOL}{eachEventMeetingBookingInfo.totalPriceEventMeetingRoom}
            </p>
            <div className={styles.buttonContainer}>
                {(eachEventMeetingBookingInfo.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES) &&
                <div className={styles.viewFoodItems}>
                    <Button onClick={()=>setViewFoodItems(true)} variant="outlined">View Food Items</Button>
                    <Modal
                        open={viewFoodItems}
                        onClose={()=>setViewFoodItems(false)}
                    >
                        <Box sx={boxStyle}>
                            <EventMeetingFoodServices eachEventMeetingBookingInfo={eachEventMeetingBookingInfo} />
                            <Button  onClick={()=>setViewFoodItems(false)} variant="contained">Ok</Button>
                        </Box>
                    </Modal>
                </div>
                }
            </div>
        </div>
    );

}

export default EventMeetingSingleDateBookingInfo;