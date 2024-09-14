'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';
import Link from 'next/link';

import styles from './UserEventMeetingBookingCart.module.css';

import UserEventMeetingSingleDateCart from "./User SubEvent Carts Component/UserEventMeetingSingleDateCart.jsx";
import UserEventMeetingMultipleDateContinuousCart from "./User SubEvent Carts Component/UserEventMeetingMultipleDateContinuousCart.jsx";
import UserEventMeetingMultipleDateNonContinuousCart from "./User SubEvent Carts Component/UserEventMeetingMultipleDateNonContinuousCart.jsx";
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";


function UserEventMeetingBookingCart(props){

    const eventMeetingCart = props.eventMeetingCart;
    console.log(eventMeetingCart);   
    const [meetingEventsRooms, setMeetingEventsRooms] = useState([]);

    useEffect(()=>{
        fetchMeetingEventsRoomInformation();
    }, []);

    async function fetchMeetingEventsRoomInformation(){
        try {
            const response = await fetch('/api/hotel-booking-information/events-meeting-room-information/');
            const meetingEventRoomInfo = await response.json();
            setMeetingEventsRooms(meetingEventRoomInfo.meetingEventsRooms);
        } catch (error) {
            console.log(error);
        }
    }


    function onRemoveEventMeetingItemFromCart(id,bookingType){
        props.onRemoveEventMeetingItemFromCart(id, bookingType);
    }


    return (
        <div className={styles.eventMeetingCartContainer}>
            {(eventMeetingCart.length > 0) && eventMeetingCart.map(function(eachEventMeetingInCart){
                const particularEventMeetingBasicInfo = meetingEventsRooms.find(function(eachEventMeetingInHotel){
                    return (eachEventMeetingInHotel.meetingEventAreaTitle == eachEventMeetingInCart.meetingEventsInfoTitle);
                });
                let subArrayOfDatesForNonContinousBooking = [];
                if(eachEventMeetingInCart.allDatesBookingInfo != undefined){
                    subArrayOfDatesForNonContinousBooking = getSubarraysOfTwoElements(eachEventMeetingInCart.allDatesBookingInfo);
                }
                
                return (
                    <div className={styles.eachEventMeetingStyles}>

                        
                        <div className={styles.eachEventMeetingCartImage}>
                            {(particularEventMeetingBasicInfo != null) &&
                            <Image src={particularEventMeetingBasicInfo.meetingEventAreaImage} alt='meeting-event' width={400} height={200} />
                            }
                        </div>
                        

                        {(eachEventMeetingInCart.roomBookingDateType == roomBookingDateTypeConstants.SINGLE_DATE) &&
                            <UserEventMeetingSingleDateCart 
                                eachEventMeetingInCart={eachEventMeetingInCart} 
                                onRemoveEventMeetingItemFromCart={onRemoveEventMeetingItemFromCart} 
                            />
                        }

                        {(eachEventMeetingInCart.roomBookingDateType == roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) &&
                            <UserEventMeetingMultipleDateContinuousCart 
                                eachEventMeetingInCart={eachEventMeetingInCart} 
                                onRemoveEventMeetingItemFromCart={onRemoveEventMeetingItemFromCart}
                            />
                        }
                        {(eachEventMeetingInCart.roomBookingDateType == roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) &&
                            <UserEventMeetingMultipleDateNonContinuousCart 
                                eachEventMeetingInCart={eachEventMeetingInCart} 
                                onRemoveEventMeetingItemFromCart={onRemoveEventMeetingItemFromCart}
                            />
                        }
                    </div>
                )
            })}
        </div>
    );
}

export default UserEventMeetingBookingCart;