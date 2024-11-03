'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import styles from './EachDiningBookingInfo.module.css';

import { getDateTextFromFullDate } from "@/functions/date.js";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


function EachDiningBookingInfo(props){

    const eachDiningBookingInfo = props.eachDiningBookingInfo;
    const transactionDetails = props.transactionDetails;

    useEffect(()=>{
        fetchDiningInformation();
    }, []);

    const [dining, setDining] = useState([]);

    async function fetchDiningInformation(){
        try {
            const response = await fetch('/api/hotel-booking-information/dining-information/');
            const diningInfo = await response.json();
            setDining(diningInfo.dining);
        } catch (error) {
            console.log(error);
        }
    }

    const particularDiningBasicInfo = dining.find(function(eachDiningInHotel){
        return (eachDiningInHotel.diningAreaTitle == eachDiningBookingInfo.diningRestaurantTitle);
    });

    return (
        <div className={styles.eachDiningBookingInfo}>
            
            
            <div className={styles.eachDiningBookingInfoImage}>
                {(particularDiningBasicInfo != null) && 
                <Image src={particularDiningBasicInfo.photo} alt='dining-image' width={430} height={210} />
                }
            </div>
            

            <div className={styles.eachDiningBookingInformation}>
                <p className={styles.eachDiningTitle}>
                    Dining Restaurant Name: {eachDiningBookingInfo.diningRestaurantTitle} 
                </p>
                {transactionDetails != null &&
                    <p className={styles.diningBookingInfoEachInfo}>
                        <span className={styles.diningBookingInfoEachInfoTitle}>Dining Table Booked On Date: </span>
                        {getDateTextFromFullDate(transactionDetails.transactionDateTime)}
                    </p>
                }
                <p className={styles.diningBookingInfoEachInfo}>
                    <span className={styles.diningBookingInfoEachInfoTitle}>Table Dining Date: </span>
                    {getDateTextFromFullDate(eachDiningBookingInfo.tableBookingDate)}
                </p>
                <p className={styles.diningBookingInfoEachInfo}>
                    <span className={styles.diningBookingInfoEachInfoTitle}>Meal Type: </span>
                    {eachDiningBookingInfo.mealType}
                </p>
                <p className={styles.diningBookingInfoEachInfo}>
                    <span className={styles.diningBookingInfoEachInfoTitle}>Table Booking Time: </span>
                    {eachDiningBookingInfo.tableBookingTime}
                </p>
                <p className={styles.diningBookingInfoEachInfo}>
                    <span className={styles.diningBookingInfoEachInfoTitle}>Total Number Of Guest: </span>
                    {eachDiningBookingInfo.noOfGuests}
                </p>
                <p className={styles.diningBookingInfoEachInfo}>
                    <span className={styles.diningBookingInfoEachInfoTitle}>Total Booking Price: </span>
                    {CURRENCY_SYMBOL}{eachDiningBookingInfo.priceForBooking}
                </p>
                <p className={styles.diningBookingInfoEachInfoTitle}>Total Number Of Tables</p>
                <div className={styles.tableInformation}>
                    <p className={styles.eachTableInfo}>
                        <span className={styles.diningBookingInfoEachInfoTitle}>Two Guest Table: </span>
                        {eachDiningBookingInfo.tableBookingCountDetails.tableCountTwoPerson}
                    </p>
                    <p className={styles.eachTableInfo}>
                        <span className={styles.diningBookingInfoEachInfoTitle}>Four Guest Table: </span>
                        {eachDiningBookingInfo.tableBookingCountDetails.tableCountFourPerson}
                    </p>
                    <p className={styles.eachTableInfo}>
                        <span className={styles.diningBookingInfoEachInfoTitle}>Six Guest Table: </span>
                        {eachDiningBookingInfo.tableBookingCountDetails.tableCountSixPerson}
                    </p>
                </div>
                
            </div>
        </div>
    )

}

export default EachDiningBookingInfo;