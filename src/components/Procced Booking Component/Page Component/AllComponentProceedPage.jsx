'use client'
import React, { useState } from "react";
import Image from 'next/image';
import Button from '@mui/material/Button';

import styles from './AllComponentProceedPage.module.css';

import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import DiningBookingInfo from "@/components/Booking Information Component/Dining Booking Information Component/DiningBookingInfo.jsx";
import RoomSuitesBookingInfo from "@/components/Booking Information Component/Rooms Suites Booking Information Component/RoomSuitesBookingInfo.jsx";
import EventMeetingBookingInfo from "@/components/Booking Information Component/Event Meeting Room Booking Information Component/EventMeetingBookingInfo.jsx";


function AllComponentProceedPage(){

    const allDiningBookingInfo = useAppSelector((reduxStore) => reduxStore.diningBookingInfoSlice.diningBookingInfo);
    const allEventMeetingBookingInfo = useAppSelector((reduxStore) => reduxStore.eventMeetingBookingInfoSlice.eventMeetingBookingInfo);
    const allRoomSuiteBookingInfo = useAppSelector((reduxStore) => reduxStore.roomSuiteBookingInfoSlice.roomSuiteBookingInfo);

    return (
        <div>
            <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

            <div className={styles.allTypeBookingInfo}>
                <RoomSuitesBookingInfo allRoomSuiteBookingInfo={allRoomSuiteBookingInfo} />
                <DiningBookingInfo allDiningBookingInfo={allDiningBookingInfo} />
                <EventMeetingBookingInfo allEventMeetingBookingInfo={allEventMeetingBookingInfo} />
            </div>

            <div className={styles.proceedBtn}>
                {(allDiningBookingInfo.length > 0 || allRoomSuiteBookingInfo.length > 0 || allEventMeetingBookingInfo.length > 0) &&
                    <Button variant="contained">
                        Proceed For Booking
                    </Button>
                }
                {(allDiningBookingInfo.length == 0 && allRoomSuiteBookingInfo.length == 0 && allEventMeetingBookingInfo.length == 0) &&
                    <Button disabled variant="contained">
                        Proceed For Booking
                    </Button>
                }
            </div>
        </div>
    );
}

export default AllComponentProceedPage;