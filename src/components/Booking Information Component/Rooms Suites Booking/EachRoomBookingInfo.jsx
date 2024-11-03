'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Button from '@mui/material/Button';

import styles from './EachRoomBookingInfo.module.css';

import { getDateTextFromOnlyDate } from "@/functions/date.js";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


function EachRoomBookingInfo(props){
    const eachRoomBookingInfo = props.eachRoomBookingInfo;
    const transactionDetails = props.transactionDetails;

    useEffect(()=>{
        fetchRoomsSuitesInformation();
    }, []);

    const [roomsSuites, setRoomsSuites] = useState([]);

    async function fetchRoomsSuitesInformation(){
        try {
            const response = await fetch('/api/hotel-booking-information/room-and-suites-information/');
            const roomSuitesInfo = await response.json();
            setRoomsSuites(roomSuitesInfo.rooms);
        } catch (error) {
            console.log(error);
        }
    }

    const [displayGuestDetails, setDisplayGuestDetails] = useState(false);

    const particularRoomBasicInfo = roomsSuites.find(function(eachRoomInHotel){
        return (eachRoomInHotel.title == eachRoomBookingInfo.bookingRoomTitle);
    });

    return (
        <div className={styles.eachRoomSuiteBookingInformation}>
            <div className={styles.eachRoomSuiteBasicBookingInfo}>
                
                <div className={styles.eachRoomSuiteImage}>
                    {(particularRoomBasicInfo != null) && 
                    <Image src={particularRoomBasicInfo.photos[0]} alt="room-image" width={400} height={200} />
                    }
                </div>
                
                <div className={styles.eachRoomSuiteBookingInfo}>
                    <p className={styles.eachRoomTitle}>
                        Room Title: {eachRoomBookingInfo.bookingRoomTitle} 
                    </p>
                    {transactionDetails != null &&
                        <p className={styles.eachRoomOtherInfo}>
                            <span className={styles.eachRoomOtherInfoTitle}>Room Booked On Date: </span> 
                            {getDateTextFromOnlyDate(transactionDetails.transactionDateTime)} 
                        </p>
                    }
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>Room CheckIn Date: </span> 
                        {getDateTextFromOnlyDate(eachRoomBookingInfo.bookingCheckinDate)}  
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>Room CheckOut Date: </span> 
                        {getDateTextFromOnlyDate(eachRoomBookingInfo.bookingCheckoutDate)} 
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>Total Number of Rooms: </span> 
                        {eachRoomBookingInfo.totalRooms} 
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>Total Number of Guests: </span> 
                        {eachRoomBookingInfo.totalGuest} 
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>Total Price Of Room: </span>
                        {CURRENCY_SYMBOL}{eachRoomBookingInfo.totalPriceOfAllRooms} 
                    </p>
                    <p onClick={()=>setDisplayGuestDetails(true)} className={styles.viewGuests}>
                        View Guest Details
                    </p>
                </div>
                
            </div>
            
            {displayGuestDetails && 
            <div className={styles.eachRoomSuiteBookingGuestContainer}>
                <div className={styles.eachRoomSuiteBookingGuestInfo}>
                    {(eachRoomBookingInfo.guestRoomsDetails).map(function(eachRoomForGuest){
                        return (
                            <div className={styles.guestDetailsStyle}>
                                <p>
                                    <span className={styles.guestDetailsTitle}>Room: </span>
                                    {eachRoomForGuest.roomNo} 
                                </p>
                                <p>
                                    <span className={styles.guestDetailsTitle}>Number of Adults: </span> 
                                    {eachRoomForGuest.noOfAdult} 
                                </p>
                                <p>
                                    <span className={styles.guestDetailsTitle}>Number of Children: </span> 
                                    {eachRoomForGuest.noOfChildren} 
                                </p>
                                <p>
                                    <span className={styles.guestDetailsTitle}>Total Guests in Room: </span>
                                    {eachRoomForGuest.total}
                                </p>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.closeGuestDetails}>
                    <Button onClick={()=>setDisplayGuestDetails(false)} variant="contained">
                        CLOSE
                    </Button>
                </div>
            </div>
            }
        </div>
    );
}

export default EachRoomBookingInfo;