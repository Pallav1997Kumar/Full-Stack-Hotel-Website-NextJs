'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import styles from './EachEventMeetingBookingInfo.module.css';

import EventMeetingSingleDateBookingInfo from "./Sub Events Booking Information Component/EventMeetingSingleDateBookingInfo.jsx";
import EventMeetingMultipleDateContinuousBookingInfo from "./Sub Events Booking Information Component/EventMeetingMultipleDateContinuousBookingInfo.jsx";
import EventMeetingMultipleDateNonContinuousBookingInfo from "./Sub Events Booking Information Component/EventMeetingMultipleDateNonContinuousBookingInfo.jsx";
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";


function EachEventMeetingBookingInfo(props){

    const eachEventMeetingBookingInfo = props.eachEventMeetingBookingInfo;

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

    const particularEventMeetingBasicInfo = meetingEventsRooms.find(function(eachEventMeetingInHotel){
        return (eachEventMeetingInHotel.meetingEventAreaTitle == eachEventMeetingBookingInfo.meetingEventsInfoTitle);
    });

    return (
        <div className={styles.eachEventMeetingStyles}>
            
            <div className={styles.eachEventMeetingBookingInfoImage}>
                {(particularEventMeetingBasicInfo != null) &&
                <Image src={particularEventMeetingBasicInfo.meetingEventAreaImage} alt='meeting-event' width={400} height={200} />
                }
            </div>
            

            {(eachEventMeetingBookingInfo.roomBookingDateType == roomBookingDateTypeConstants.SINGLE_DATE) &&
                <EventMeetingSingleDateBookingInfo eachEventMeetingBookingInfo={eachEventMeetingBookingInfo}  />
            }

            {(eachEventMeetingBookingInfo.roomBookingDateType == roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) &&
                <EventMeetingMultipleDateContinuousBookingInfo eachEventMeetingBookingInfo={eachEventMeetingBookingInfo} />
            }
            {(eachEventMeetingBookingInfo.roomBookingDateType == roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) &&
                <EventMeetingMultipleDateNonContinuousBookingInfo eachEventMeetingBookingInfo={eachEventMeetingBookingInfo} />
            }
        </div>
    )
}

export default EachEventMeetingBookingInfo;