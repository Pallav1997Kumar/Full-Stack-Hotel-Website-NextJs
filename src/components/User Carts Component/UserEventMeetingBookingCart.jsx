'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';
import Link from 'next/link';

import styles from './UserEventMeetingBookingCart.module.css';

import UserEventMeetingSingleDateCart from "./User SubEvent Carts Component/UserEventMeetingSingleDateCart.jsx";
import UserEventMeetingMultipleDateContinuousCart from "./User SubEvent Carts Component/UserEventMeetingMultipleDateContinuousCart.jsx";
import UserEventMeetingMultipleDateNonContinuousCart from "./User SubEvent Carts Component/UserEventMeetingMultipleDateNonContinuousCart.jsx";


function UserEventMeetingBookingCart(props){

    const eventMeetingCart = props.eventMeetingCart;
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
                        

                        {(eachEventMeetingInCart.roomBookingDateType == 'Single Date') &&
                            <UserEventMeetingSingleDateCart eachEventMeetingInCart={eachEventMeetingInCart}  />
                        }

                        {(eachEventMeetingInCart.roomBookingDateType == 'Multiple Dates Continuous') &&
                            <UserEventMeetingMultipleDateContinuousCart eachEventMeetingInCart={eachEventMeetingInCart} />
                        }
                        {(eachEventMeetingInCart.roomBookingDateType == 'Multiple Dates Non Continuous') &&
                            <UserEventMeetingMultipleDateNonContinuousCart eachEventMeetingInCart={eachEventMeetingInCart} />
                        }
                    </div>
                )
            })}
        </div>
    );
}

export default UserEventMeetingBookingCart;