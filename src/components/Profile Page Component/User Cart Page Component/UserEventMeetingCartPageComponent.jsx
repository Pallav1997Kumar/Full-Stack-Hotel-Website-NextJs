'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Button from '@mui/material/Button';
import Image from 'next/image';

import styles from './UserDiningRoomsSuitesEventMeetingStyle.module.css';

import { useAppSelector } from "@/redux store/hooks";
import { EVENT_MEETING_ROOM_PRESENT_IN_CART, EVENT_MEETING_ROOM_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import UserEventMeetingBookingCart from "@/components/User Carts Component/UserEventMeetingBookingCart.jsx";


function UserEventMeetingCartPageComponent(){

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    useEffect(()=>{
        fetchEventMeetingCartDb(loginUserId);
    }, []);

    const [eventMeetingCart, setEventMeetingCart] = useState(null);


    async function fetchEventMeetingCartDb(loginUserId) {
        try {
            const response = await fetch(`/api/view-cart/meeting-events/${loginUserId}`);
            const data = await response.json();
            if(response.status === 200){
                if(data.message === EVENT_MEETING_ROOM_CART_IS_EMPTY){
                    const eventMeetingCartDb = null;
                    setEventMeetingCart(eventMeetingCartDb);
                }
                else if(data.message === EVENT_MEETING_ROOM_PRESENT_IN_CART){
                    const eventMeetingCartDb = data.eventMeetingCartInfo;
                    setEventMeetingCart(eventMeetingCartDb);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    async function removeEventMeetingItemFromCart(id, bookingType){
        if(bookingType === roomBookingDateTypeConstants.SINGLE_DATE){
            await removeEventMeetingSingleDateItemFromCartDb(id);
        }
        else if(bookingType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS){
            await removeEventMeetingMultipleDatesContinuousItemFromCartDb(id);
        }
        else if(bookingType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS){
            await removeEventMeetingMultipleDatesNonContinuousItemFromCartDb(id);
        }
    }


    async function removeEventMeetingSingleDateItemFromCartDb(id){
        try {
            const response = await fetch(`/api/delete-cart/meeting-events/single-date/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data = await response.json();   
            if(response.status !== 200){
                
            } 
            if(response.status === 200){
                await fetchEventMeetingCartDb(loginUserId);
            } 
        } 
        catch (error) {
            console.log(error);
        }
    }


    async function removeEventMeetingMultipleDatesContinuousItemFromCartDb(id){
        try {
            const response = await fetch(`/api/delete-cart/meeting-events/multiple-dates-continous/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data = await response.json();   
            if(response.status !== 200){
            }  
            if(response.status === 200){
                await fetchEventMeetingCartDb(loginUserId);
            } 
        } 
        catch (error) {
            console.log(error);
        }
    }


    async function removeEventMeetingMultipleDatesNonContinuousItemFromCartDb(id){
        try {
            const response = await fetch(`/api/delete-cart/meeting-events/multiple-dates-non-continous/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data = await response.json();   
            if(response.status !== 200){
            }  
            if(response.status === 200){
                await fetchEventMeetingCartDb(loginUserId);
            } 
        } 
        catch (error) {
            console.log(error);
        }
    }



    if(eventMeetingCart === null){
        return (
            <React.Fragment>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

                <div className={styles.breadcrumbsContainer}>
                    <p>
                        <Link href="/">
                            <span className={styles.breadcrumbsLink}> HOME </span>
                        </Link> 
                        <span>{'>>'}</span> 
                        <Link href="/profile-home-page"> 
                            <span className={styles.breadcrumbsLink}> PROFILE PAGE </span>
                        </Link>
                        <span>{'>>'}</span> 
                        <Link href={`/profile-home-page/my-cart/${loginUserId}`}> 
                            <span className={styles.breadcrumbsLink}> MY ACCOUNT CART </span>
                        </Link>
                        <span>{'>>'}</span>
                        <Link href={`/profile-home-page/my-cart/event-meeting-rooms/${loginUserId}`}> 
                            <span className={styles.breadcrumbsLink}> MY ACCOUNT EVENTS AND MEETING ROOM CART </span>
                        </Link>
                    </p>
                </div>

                <div className={styles.emptyCart}>
                    <p>Meeting and Event Rooom Cart is Empty</p>
                    <p>Click on Below Button to Add Items</p>
                    <Link href={`/meetings-events/`} passHref>
                        <Button variant="contained">Meeting and Event Room Page</Button>
                    </Link>
                </div>
            </React.Fragment>
        );
    }


    return (
        <div>
            <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />
            
            <div className={styles.breadcrumbsContainer}>
                <p>
                    <Link href="/">
                        <span className={styles.breadcrumbsLink}> HOME </span>
                    </Link> 
                    <span>{'>>'}</span> 
                    <Link href="/profile-home-page"> 
                        <span className={styles.breadcrumbsLink}> PROFILE PAGE </span>
                    </Link>
                    <span>{'>>'}</span> 
                    <Link href={`/profile-home-page/my-cart/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> MY ACCOUNT CART </span>
                    </Link>
                    <span>{'>>'}</span>
                    <Link href={`/profile-home-page/my-cart/rooms-suites/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> MY ACCOUNT DINING CART </span>
                    </Link>
                </p>
            </div>

            {(eventMeetingCart !== null && eventMeetingCart.length > 0) &&
                <UserEventMeetingBookingCart 
                    eventMeetingCart={eventMeetingCart} 
                    onRemoveEventMeetingItemFromCart={removeEventMeetingItemFromCart}
                />
            }
        </div>
    );

}


export default UserEventMeetingCartPageComponent;