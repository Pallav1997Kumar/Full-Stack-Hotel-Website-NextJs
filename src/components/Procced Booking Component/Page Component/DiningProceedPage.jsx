'use client'
import React, { useState } from "react";
import Image from 'next/image';
import Button from '@mui/material/Button';

import styles from './DiningProceedPage.module.css';

import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import DiningBookingInfo from "@/components/Booking Information Component/Dining Booking Information Component/DiningBookingInfo.jsx";


function DiningProceedPage(props){
    const allDiningBookingInfo = useAppSelector((reduxStore) => reduxStore.diningBookingInfoSlice.diningBookingInfo);

    return (
        <div>
            <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

            <div className={styles.diningBookingInfo}>
                <DiningBookingInfo allDiningBookingInfo={allDiningBookingInfo} />
            </div>

            <div className={styles.proceedBtn}>
                {allDiningBookingInfo.length > 0 &&
                    <Button variant="contained">
                        Proceed For Booking
                    </Button>
                }
                {allDiningBookingInfo.length == 0 &&
                    <Button disabled variant="contained">
                        Proceed For Booking
                    </Button>
                }
            </div>
        </div>
    );
}

export default DiningProceedPage;