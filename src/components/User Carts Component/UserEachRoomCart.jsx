'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Button from '@mui/material/Button';

import styles from "./UserEachRoomCart.module.css";

import { getDateTextFromOnlyDate } from "@/functions/date.js";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


function UserEachRoomCart(props){

    const eachRoomInCart = props.eachRoomInCart;
    const isRoomSuiteChecked = props.isRoomSuiteChecked;
    
    const [roomsSuites, setRoomsSuites] = useState([]);
    const [displayGuestDetails, setDisplayGuestDetails] = useState(false);

    useEffect(()=>{
        fetchRoomsSuitesInformation();
    }, []);

    const particularRoomBasicInfo = roomsSuites.find(function(eachRoomInHotel){
        return (eachRoomInHotel.title == eachRoomInCart.bookingRoomTitle);
    });


    async function fetchRoomsSuitesInformation(){
        try {
            const response = await fetch('/api/hotel-booking-information/room-and-suites-information/');
            const roomSuitesInfo = await response.json();
            setRoomsSuites(roomSuitesInfo.rooms);
        } catch (error) {
            console.log(error);
        }
    }

    async function removeRoomsSuitesItemFromCart(id){
        props.onRemoveRoomsSuitesItemFromCart(id);
    }

    function handleCheckboxChange(event, id){
        props.onGetRoomsSuitesCheckboxInfo(event, id);
    }


    return(
        <div className={styles.eachRoomCart}>
            <div className={styles.eachRoomBasicCart}>

                <div className={styles.roomCartCheckbox}>
                    <input 
                        type="checkbox" 
                        checked={isRoomSuiteChecked}
                        onChange={()=>handleCheckboxChange(event, eachRoomInCart._id)}      
                    />
                </div>

                <div className={styles.eachRoomCartImage}>
                    {(particularRoomBasicInfo != null) && 
                    <Image src={particularRoomBasicInfo.photos[0]} alt="room-image" width={400} height={200} />
                    }
                </div>

                <div className={styles.eachRoomCartInformation}>
                    <p className={styles.eachRoomTitle}>
                        Room Title: {eachRoomInCart.bookingRoomTitle} 
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>CheckIn Date: </span> 
                        {getDateTextFromOnlyDate(eachRoomInCart.bookingCheckinDate)}  
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>CheckOut Date: </span> 
                        {getDateTextFromOnlyDate(eachRoomInCart.bookingCheckoutDate)}  
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
                    
                    <Button 
                        onClick={()=>removeRoomsSuitesItemFromCart(eachRoomInCart._id)} 
                        variant="contained"
                    >
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

export default UserEachRoomCart;