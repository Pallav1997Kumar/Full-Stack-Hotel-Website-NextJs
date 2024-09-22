'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@mui/material/Button';
//import { useAppSelector } from "@/redux store/store.js";
import { useSelector } from 'react-redux';

import styles from "./DiningBookingCartComponent.module.css";

import { getDateTextFromFullDate } from "@/functions/date.js";
import { useAppDispatch } from "@/redux store/hooks.js";
import { deleteParticularBookingFromDiningCart } from "@/redux store/features/Booking Features/diningBookingCartSlice.js";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


function DiningBookingCartComponent(){

    const allDiningBookingCart = useSelector((reduxStore) => reduxStore.diningCartSlice.diningCart);
    console.log(allDiningBookingCart);

    const dispatch = useAppDispatch();

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


    function removeDiningFromCartHandler(diningBookingID){
        dispatch(deleteParticularBookingFromDiningCart(diningBookingID));
    }


    if(allDiningBookingCart.length == 0){
        return (
            <div className={styles.emptyCart}>
                <p>Dining Cart is Empty</p>
                <p>Click on Below Button to Add Items</p>
                <Link href={`/dining/`} passHref>
                    <Button variant="contained">Dining Page</Button>
                </Link>
            </div>
        );
    }


    return (
        <div className={styles.diningCartContainer}>
            {(allDiningBookingCart.length > 0) && allDiningBookingCart.map(function(eachDiningInCart){
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
                                {CURRENCY_SYMBOL}{eachDiningInCart.priceForBooking}
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
                            <Button variant="contained" onClick={()=>removeDiningFromCartHandler(eachDiningInCart.diningCartId)}>
                                Remove From Cart
                            </Button>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

export default DiningBookingCartComponent;