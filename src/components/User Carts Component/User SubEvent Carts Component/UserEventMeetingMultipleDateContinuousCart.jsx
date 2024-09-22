'use client'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import React, { useState } from 'react';

import styles from './UserEventMeetingMultipleDateContinuousCart.module.css';

import { getDateTextFromFullDate } from "@/functions/date.js";
import { getCommaAndSeperatedArray, getSubarraysOfTwoElements } from "@/functions/array.js";
import UserEventMeetingFoodServices from "./Food Services Of Event/UserEventMeetingFoodServices.jsx";
import { wantFoodServiceConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


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


function UserEventMeetingMultipleDateContinuousCart(props){
    const eachEventMeetingInCart = props.eachEventMeetingInCart;
    const [viewFoodItems, setViewFoodItems] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    async function removeEventMeetingMultipleDatesContinuousItemFromCart(id, bookingType){
        props.onRemoveEventMeetingItemFromCart(id, bookingType);
    }


    return (
        <div className={styles.eachEventMeetingCartInformation}>
            <p className={styles.eachEventMeetingTitle}>
                Meeting / Event Area Name: {eachEventMeetingInCart.meetingEventsInfoTitle}
            </p>
            <p className={styles.eventMeetingCartEachInfo}>
                <span className={styles.eventMeetingCartEachInfoTitle}>Meeting / Event Start Booking Date: </span>
                {getDateTextFromFullDate(eachEventMeetingInCart.meetingEventStartBookingDate)}
            </p>
            <p className={styles.eventMeetingCartEachInfo}>
                <span className={styles.eventMeetingCartEachInfoTitle}>Meeting / Event End Booking Date: </span>
                {getDateTextFromFullDate(eachEventMeetingInCart.meetingEventEndBookingDate)}
            </p>
            {(eachEventMeetingInCart.meetingEventBookingTime.length > 1) &&
                <p className={styles.eventMeetingCartEachInfo}>
                    <span className={styles.eventMeetingCartEachInfoTitle}>Meeting / Event Booking Time: </span>
                    {getCommaAndSeperatedArray(eachEventMeetingInCart.meetingEventBookingTime)}
                </p>
            }
            {(eachEventMeetingInCart.meetingEventBookingTime.length == 1) &&
                <p className={styles.eventMeetingCartEachInfo}>
                    <span className={styles.eventMeetingCartEachInfoTitle}>Meeting / Event Booking Time: </span>
                    {eachEventMeetingInCart.meetingEventBookingTime[0]}
                </p>
            }
            <p className={styles.eventMeetingCartEachInfo}>
                <span className={styles.eventMeetingCartEachInfoTitle}>Meeting / Event Seating Arrangement: </span>
                {eachEventMeetingInCart.meetingEventSeatingArrangement}
            </p>
            <p className={styles.eventMeetingCartEachInfo}>
                <span className={styles.eventMeetingCartEachInfoTitle}>Number of Guests Attending: </span>
                {eachEventMeetingInCart.maximumGuestAttending}
            </p>
            <p className={styles.eventMeetingCartEachInfo}>
                <span className={styles.eventMeetingCartEachInfoTitle}>Food Services Included: </span>
                {eachEventMeetingInCart.wantFoodServices}
            </p>
            <p className={styles.eventMeetingCartEachInfo}>
                <span className={styles.eventMeetingCartEachInfoTitle}>Total Price of Event/Meeting Room: </span>
                {CURRENCY_SYMBOL}{eachEventMeetingInCart.totalPriceEventMeetingRoom}
            </p>
            <div className={styles.buttonContainer}>
                
                <Button 
                    onClick={()=>removeEventMeetingMultipleDatesContinuousItemFromCart(eachEventMeetingInCart._id, eachEventMeetingInCart.roomBookingDateType)} 
                    variant="contained"
                >
                    Remove From Cart
                </Button>
                
                {(eachEventMeetingInCart.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES) &&
                <div className={styles.viewFoodItems}>
                    <Button onClick={()=>setViewFoodItems(true)} variant="outlined">View Food Items</Button>
                    <Modal
                        open={viewFoodItems}
                        onClose={()=>setViewFoodItems(false)}
                    >
                        <Box sx={boxStyle}>
                            <UserEventMeetingFoodServices eachEventMeetingInCart={eachEventMeetingInCart} />
                            <Button onClick={()=>setViewFoodItems(false)} variant="contained">Ok</Button>
                        </Box>
                    </Modal>
                </div>
                }
            </div>
        </div>
    );
}

export default UserEventMeetingMultipleDateContinuousCart;