'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';
import Link from 'next/link';
//import { useAppSelector } from "@/redux store/store.js";
import { useSelector } from 'react-redux';

import styles from "./EventMeetingRoomBookingCartComponent.module.css";

import { getDateTextFromFullDate } from "@/functions/date.js";
import { getCommaAndSeperatedArray, getSubarraysOfTwoElements } from "@/functions/array.js";
import EventMeetingSingleDateCartComponent from "./Sub Events Cart Component/EventMeetingSingleDateCartComponent.jsx";
import EventMeetingMultipleDateContinuousCartComponent from "./Sub Events Cart Component/EventMeetingMultipleDateContinuousCartComponent.jsx";
import EventMeetingMultipleDateNonContinuousCartComponent from "./Sub Events Cart Component/EventMeetingMultipleDateNonContinuousCartComponent.jsx";
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";


function EventMeetingRoomBookingCartComponent(){
    const allEventMeetingBookingCart = useSelector((reduxStore) => reduxStore.eventMeetingCartSlice.eventMeetingCart);
    console.log(allEventMeetingBookingCart);

    useEffect(()=>{
        fetchMeetingEventsRoomInformation();
    }, []);

    const [meetingEventsRooms, setMeetingEventsRooms] = useState([]);

    async function fetchMeetingEventsRoomInformation(){
        try {
            const response = await fetch('/api/hotel-booking-information/events-meeting-room-information/');
            const meetingEventRoomInfo = await response.json();
            setMeetingEventsRooms(meetingEventRoomInfo.meetingEventsRooms);
        } catch (error) {
            console.log(error);
        }
    }


    if(allEventMeetingBookingCart.length == 0){
        return (
            <div className={styles.emptyCart}>
                <p>Event and Meeting Room Cart is Empty</p>
                <p>Click on Below Button to Add Items</p>
                <Link href={`/meetings-events/`} passHref>
                    <Button variant="contained">Event and Meeting Room Page</Button>
                </Link>
            </div>
        );
    }


    return (
        <div className={styles.eventMeetingCartContainer}>
            {(allEventMeetingBookingCart.length > 0) && allEventMeetingBookingCart.map(function(eachEventMeetingInCart){
                const particularEventMeetingBasicInfo = meetingEventsRooms.find(function(eachEventMeetingInHotel){
                    return (eachEventMeetingInHotel.meetingEventAreaTitle == eachEventMeetingInCart.meetingEventsInfoTitle);
                });
                let subArrayOfDatesForNonContinousBooking = [];
                if(eachEventMeetingInCart.allDatesBookingInfo != undefined){
                    subArrayOfDatesForNonContinousBooking = getSubarraysOfTwoElements(eachEventMeetingInCart.allDatesBookingInfo);
                    // console.log(subArrayOfDatesForNonContinousBooking);
                }
                
                return (
                    <div className={styles.eachEventMeetingStyles}>

                        
                        <div className={styles.eachEventMeetingCartImage}>
                            {(particularEventMeetingBasicInfo != null) &&
                            <Image src={particularEventMeetingBasicInfo.meetingEventAreaImage} alt='meeting-event' width={400} height={200} />
                            }
                        </div>
                        

                        {(eachEventMeetingInCart.roomBookingDateType == roomBookingDateTypeConstants.SINGLE_DATE) &&
                            <EventMeetingSingleDateCartComponent eachEventMeetingInCart={eachEventMeetingInCart}  />
                        }

                        {(eachEventMeetingInCart.roomBookingDateType == roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) &&
                            <EventMeetingMultipleDateContinuousCartComponent eachEventMeetingInCart={eachEventMeetingInCart} />
                        }
                        {(eachEventMeetingInCart.roomBookingDateType == roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) &&
                            <EventMeetingMultipleDateNonContinuousCartComponent eachEventMeetingInCart={eachEventMeetingInCart} />
                        }
                    </div>
                )
            })}
        </div>
    );
}

export default EventMeetingRoomBookingCartComponent;