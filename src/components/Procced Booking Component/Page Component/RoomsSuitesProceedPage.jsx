'use client'
import React, { useState } from "react";
import Image from 'next/image';
import Button from '@mui/material/Button';

import styles from './RoomsSuitesProceedPage.module.css';

import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import RoomSuitesBookingInfo from "@/components/Booking Information Component/Rooms Suites Booking Information Component/RoomSuitesBookingInfo.jsx";


function RoomsSuitesProceedPage(props){
    const allRoomSuiteBookingInfo = useAppSelector((reduxStore) => reduxStore.roomSuiteBookingInfoSlice.roomSuiteBookingInfo);

    return (
        <div>
            <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

            <div className={styles.roomSuiteBookingInfo}>
                <RoomSuitesBookingInfo allRoomSuiteBookingInfo={allRoomSuiteBookingInfo} />
            </div>

            <div className={styles.proceedBtn}>
                {allRoomSuiteBookingInfo.length > 0 &&
                    <Button variant="contained">
                        Proceed For Booking
                    </Button>
                }
                {allRoomSuiteBookingInfo.length == 0 &&
                    <Button disabled variant="contained">
                        Proceed For Booking
                    </Button>
                }
            </div>
        </div>
    );
}

export default RoomsSuitesProceedPage;