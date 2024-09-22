'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Button from '@mui/material/Button';

import styles from "./EachRoomCartComponent.module.css";

import { getDateTextFromOnlyDate } from "@/functions/date.js";
import { useAppDispatch } from "@/redux store/hooks.js";
import { deleteParticularBookingFromRoomCart } from "@/redux store/features/Booking Features/roomBookingCartSlice.js";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


function EachRoomCartComponent(props){

    const dispatch = useAppDispatch();

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
    const eachRoomInCart = props.eachRoomInCart;
    const particularRoomBasicInfo = roomsSuites.find(function(eachRoomInHotel){
        return (eachRoomInHotel.title == eachRoomInCart.roomTitle);
    });


    function removeRoomFromCartHandler(roomID){
        dispatch(deleteParticularBookingFromRoomCart(roomID));
    }


    return (
        <div className={styles.eachRoomCart}>
            <div className={styles.eachRoomBasicCart}>
                
                <div className={styles.eachRoomCartImage}>
                    {(particularRoomBasicInfo != null) && 
                    <Image src={particularRoomBasicInfo.photos[0]} alt="room-image" width={400} height={200} />
                    }
                </div>
                
                <div className={styles.eachRoomCartInformation}>
                    <p className={styles.eachRoomTitle}>
                        Room Title: {eachRoomInCart.roomTitle} 
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>CheckIn Date: </span> 
                        {getDateTextFromOnlyDate(eachRoomInCart.checkinDate)}  
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>CheckOut Date: </span> 
                        {getDateTextFromOnlyDate(eachRoomInCart.checkoutDate)} 
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>Total Number of Rooms: </span> 
                        {eachRoomInCart.totalRooms} 
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>Total Number of Guests: </span> 
                        {eachRoomInCart.totalGuest} 
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>Total Price Of Room: </span>
                        {CURRENCY_SYMBOL}{eachRoomInCart.totalPriceOfAllRooms} 
                    </p>
                    <Button onClick={()=> removeRoomFromCartHandler(eachRoomInCart.roomCartId)} variant="contained">
                        Remove From Cart
                    </Button>
                    <p onClick={()=>setDisplayGuestDetails(true)} className={styles.viewGuests}>
                        View Guest Details
                    </p>
                </div>
                
            </div>
            
            {displayGuestDetails && 
            <div className={styles.eachRoomCartGuestContainer}>
                <div className={styles.eachRoomCartGuestInfo}>
                    {(eachRoomInCart.guestRoomsDetails).map(function(eachRoomForGuest){
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

export default EachRoomCartComponent;