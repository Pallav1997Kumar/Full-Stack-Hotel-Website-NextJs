'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';

import styles from "./UserDiningBookingCart.module.css";

import { getDateTextFromFullDate } from "@/functions/date.js";


function UserDiningBookingCart(props){

    const diningCart = props.diningCart;
    const [dining, setDining] = useState([]);

    useEffect(()=>{
        fetchDiningInformation();
    }, []);
    

    async function fetchDiningInformation(){
        try {
            const response = await fetch('/api/hotel-booking-information/dining-information/');
            const diningInfo = await response.json();
            setDining(diningInfo.dining);
        } catch (error) {
            console.log(error);
        }
    }

    function removeDiningItemFromCart(id){
        props.onRemoveDiningItemFromCart(id);
    }


    return (
        <div className={styles.diningCartContainer}>
            {(diningCart.length > 0) && diningCart.map(function(eachDiningInCart){
                const particularDiningBasicInfo = dining.find(function(eachDiningInHotel){
                    return (eachDiningInHotel.diningAreaTitle == eachDiningInCart.diningRestaurantTitle);
                });
                return (
                    <div className={styles.eachDiningInCart}>
                        
                        
                        <div className={styles.eachDiningCartImage}>
                            {(particularDiningBasicInfo != null) && 
                            <Image src={particularDiningBasicInfo.photo} alt='dining-image' width={400} height={230} />
                            }
                        </div>
                        

                        <div className={styles.eachDiningCartInformation}>
                            <p className={styles.eachDiningTitle}>
                                Dining Restaurant Name: {eachDiningInCart.diningRestaurantTitle} 
                            </p>
                            <p className={styles.diningCartEachInfo}>
                                <span className={styles.diningCartEachInfoTitle}>Table Booking Date: </span>
                                {getDateTextFromFullDate(eachDiningInCart.tableBookingDate)}
                            </p>
                            <p className={styles.diningCartEachInfo}>
                                <span className={styles.diningCartEachInfoTitle}>Meal Type: </span>
                                {eachDiningInCart.mealType}
                            </p>
                            <p className={styles.diningCartEachInfo}>
                                <span className={styles.diningCartEachInfoTitle}>Table Booking Time: </span>
                                {eachDiningInCart.tableBookingTime}
                            </p>
                            <p className={styles.diningCartEachInfo}>
                                <span className={styles.diningCartEachInfoTitle}>Total Number Of Guest: </span>
                                {eachDiningInCart.noOfGuests}
                            </p>
                            <p className={styles.diningCartEachInfo}>
                                <span className={styles.diningCartEachInfoTitle}>Total Booking Price: </span>
                                {eachDiningInCart.priceForBooking}
                            </p>
                            <p className={styles.diningCartEachInfoTitle}>Total Number Of Tables</p>
                            <div className={styles.tableInformation}>
                                <p className={styles.eachTableInfo}>
                                    <span className={styles.diningCartEachInfoTitle}>Two Guest Table: </span>
                                    {eachDiningInCart.tableBookingCountDetails.tableCountTwoPerson}
                                </p>
                                <p className={styles.eachTableInfo}>
                                    <span className={styles.diningCartEachInfoTitle}>Four Guest Table: </span>
                                    {eachDiningInCart.tableBookingCountDetails.tableCountFourPerson}
                                </p>
                                <p className={styles.eachTableInfo}>
                                    <span className={styles.diningCartEachInfoTitle}>Six Guest Table: </span>
                                    {eachDiningInCart.tableBookingCountDetails.tableCountSixPerson}
                                </p>
                            </div>
                            
                            <Button 
                                onClick={()=>removeDiningItemFromCart(eachDiningInCart._id)} 
                                variant="contained"
                            >
                                Remove From Cart
                            </Button>
                            
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

export default UserDiningBookingCart;