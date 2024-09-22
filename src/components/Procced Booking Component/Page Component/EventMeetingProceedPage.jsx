'use client'
import React, { useState } from "react";
import Image from 'next/image';
import Button from '@mui/material/Button';

import styles from './EventMeetingProceedPage.module.css';

import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import EventMeetingBookingInfo from "@/components/Booking Information Component/Event Meeting Room Booking Information Component/EventMeetingBookingInfo.jsx";


function EventMeetingProceedPage(props){
    const allEventMeetingBookingInfo = useAppSelector((reduxStore) => reduxStore.eventMeetingBookingInfoSlice.eventMeetingBookingInfo);

    return (
        <div>
            <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

            <div className={styles.eventMeetingBookingInfo}>
                <EventMeetingBookingInfo allEventMeetingBookingInfo={allEventMeetingBookingInfo} />
            </div>

            <div className={styles.proceedBtn}>
                {allEventMeetingBookingInfo.length > 0 &&
                    <Button variant="contained">
                        Proceed For Booking
                    </Button>
                }
                {allEventMeetingBookingInfo.length == 0 &&
                    <Button disabled variant="contained">
                        Proceed For Booking
                    </Button>
                }
            </div>
        </div>
    );
}

export default EventMeetingProceedPage;