import Button from '@mui/material/Button';
import React, { useState } from 'react';

import styles from "./UserEventMeetingMultipleDateNonContinuousCart.module.css";

import UserEventMeetingEachDayNonContinuous from './UserEventMeetingEachDayNonContinuous.jsx';
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


function UserEventMeetingMultipleDateNonContinuousCart(props){

    const eachEventMeetingInCart = props.eachEventMeetingInCart;
    const [errorMessage, setErrorMessage] = useState('');


    async function removeEventMeetingMultipleDatesNonContinuousItemFromCartDb(id, bookingType){
        props.onRemoveEventMeetingItemFromCart(id, bookingType);
    }


    return (
        <div className={styles.eachEventMeetingCartInformation}>
            <p className={styles.eachEventMeetingTitle}>
                Meeting / Event Area Name: {eachEventMeetingInCart.meetingEventsInfoTitle}
            </p>
            {(Object.hasOwn(eachEventMeetingInCart, 'allDatesBookingInformation')) &&
                <div className={styles.allDateNumber}>
                    {(eachEventMeetingInCart.allDatesBookingInformation).map(function(eachBookingDate){
                        return(
                            <UserEventMeetingEachDayNonContinuous eachBookingDate={eachBookingDate} />
                        )
                   })} 
                </div>
            }
            <p>
                <span className={styles.totalValueTitle}>Total Price All Rooms: </span>
                {CURRENCY_SYMBOL}{eachEventMeetingInCart.totalPriceOfAllDates}
            </p>
            
            <Button 
                onClick={()=>removeEventMeetingMultipleDatesNonContinuousItemFromCartDb(eachEventMeetingInCart._id, eachEventMeetingInCart.roomBookingDateType)} 
                variant="contained"
            >
                Remove From Cart
            </Button>

        </div>
    );

}

export default UserEventMeetingMultipleDateNonContinuousCart;