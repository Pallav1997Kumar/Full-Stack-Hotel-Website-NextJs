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
   
    const [meetingEventsRooms, setMeetingEventsRooms] = useState([]);
    const [checkedId, setCheckedId] = useState([]);

    useEffect(()=>{
        fetchMeetingEventsRoomInformation();
    }, []);

    props.onGetCheckIdEventMeetingCart(checkedId);

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

    function handleCheckboxChange(event, id, roomBookingDateType){
        const isChecked = event.target.checked;
        const cartIdWithRoomBookingDateType = {
            id, 
            roomBookingDateType
        }
        if(isChecked){
            setCheckedId(function(previousCheckedItems){
                return (
                    [...previousCheckedItems, cartIdWithRoomBookingDateType]
                );
            });
        }
        if(!isChecked){
            setCheckedId(checkedId.filter(function(eachIdWithRoomBookingDateType){
                return (eachIdWithRoomBookingDateType.id !== id && eachIdWithRoomBookingDateType.roomBookingDateType !== roomBookingDateType);
            }))
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
                const checkedWithSameId = checkedId.filter(function(eachIdWithRoomBookingDateType){
                    return (eachIdWithRoomBookingDateType.id === eachEventMeetingInCart._id && eachIdWithRoomBookingDateType.roomBookingDateType === eachEventMeetingInCart.roomBookingDateType) 
                });
                //const isEventMeetingItemChecked = checkedId.includes(eachEventMeetingInCart._id);
                const isEventMeetingItemChecked = checkedWithSameId.length > 0 ? true: false;
                
                return (
                    <div className={styles.eachEventMeetingStyles}>

                        <div className={styles.eachEventMeetingCartCheckbox}>
                            <input 
                                type="checkbox"
                                checked={isEventMeetingItemChecked}
                                onChange={(event)=>handleCheckboxChange(event, eachEventMeetingInCart._id, eachEventMeetingInCart.roomBookingDateType)} 
                            />
                        </div>

                        
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