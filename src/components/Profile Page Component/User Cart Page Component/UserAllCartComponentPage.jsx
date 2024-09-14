'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';

import styles from './UserAllCartComponentPage.module.css';

import { useAppSelector } from "@/redux store/hooks";
import UserRoomSuiteBookingCart from "@/components/User Carts Component/UserRoomSuiteBookingCart.jsx";
import UserDiningBookingCart from "@/components/User Carts Component/UserDiningBookingCart.jsx";
import UserEventMeetingBookingCart from "@/components/User Carts Component/UserEventMeetingBookingCart.jsx";
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";
import { ROOMS_SUITES_PRESENT_IN_CART, ROOMS_SUITES_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import { EVENT_MEETING_ROOM_PRESENT_IN_CART, EVENT_MEETING_ROOM_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import { DINING_PRESENT_IN_CART, DINING_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";


function UserAllCartComponentPage(){
    
    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    useEffect(()=>{
        fetchRoomSuiteCartDb(loginUserId);
        fetchDiningCartDb(loginUserId);
        fetchEventMeetingCartDb(loginUserId);
    }, []);

    const [roomSuitesCart, setRoomSuitesCart] = useState(null);
    const [diningCart, setDiningCart] = useState(null);
    const [eventMeetingCart, setEventMeetingCart] = useState(null);


    async function fetchRoomSuiteCartDb(loginUserId) {
        try {
            const response = await fetch(`/api/view-cart/rooms-suites/${loginUserId}`);
            const data = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if(data.message === ROOMS_SUITES_CART_IS_EMPTY){
                    const roomSuitesCartDb = null;
                    setRoomSuitesCart(roomSuitesCartDb);
                }
                else if(data.message === ROOMS_SUITES_PRESENT_IN_CART){
                    const roomSuitesCartDb = data.roomSuiteCartInfo;
                    setRoomSuitesCart(roomSuitesCartDb);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchDiningCartDb(loginUserId) {
        try {
            const response = await fetch(`/api/view-cart/dining/${loginUserId}`);
            const data = await response.json();
            if(response.status === 200){
                if(data.message === DINING_CART_IS_EMPTY){
                    const diningCartDb = null;
                    setDiningCart(diningCartDb);
                }
                else if(data.message === DINING_PRESENT_IN_CART){
                    const diningCartDb = data.diningCartInfo;
                    setDiningCart(diningCartDb);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

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


    async function removeDiningItemFromCartDb(id) {
        try {
            const response = await fetch(`/api/delete-cart/dining/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data = await response.json();   
            if(response.status !== 200){

            }  
            if(response.status === 200){
                await fetchDiningCartDb(loginUserId);
            }
        } 
        catch (error) {
            console.log(error);
        }
    }


    async function removeRoomsSuitesItemFromCartDb(id){
        try {
            const response = await fetch(`/api/delete-cart/rooms-suites/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data = await response.json();   
            if(response.status !== 200){
            }  
            if(response.status === 200){
                await fetchRoomSuiteCartDb(loginUserId);
            }   
        } 
        catch (error) {
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




    return (
        <React.Fragment>

            <div>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />
            </div>

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
                </p>
            </div>

            <div className={styles.myCart}>
                <h2>MY CARTS</h2>

                <div className={styles.categoryCart}>
                    <h4>Category Wise Cart</h4>
                    <ol>
                        <li>
                            <Link href={`/profile-home-page/my-cart/rooms-suites/${loginUserId}`}>
                                Rooms & Suites Cart
                            </Link>
                        </li>
                        <li>
                            <Link href={`/profile-home-page/my-cart/dining/${loginUserId}`}>
                                Dining Cart
                            </Link>
                        </li>
                        <li>
                            <Link href={`/profile-home-page/my-cart/event-meeting-rooms/${loginUserId}`}>
                                Events/ Meeting Rooms Cart
                            </Link>
                        </li>
                    </ol>
                </div>

                <div className={styles.allCart}>
                    <h3>All Carts</h3>
                    
                    {(roomSuitesCart === null && diningCart === null && eventMeetingCart === null) &&
                        <div className={styles.emptyCart}>
                            <p>Your Cart is Empty</p>
                            <p>Add Items in Your Cart</p>
                        </div>
                    }

                    {(roomSuitesCart !== null && roomSuitesCart.length > 0) &&
                        <UserRoomSuiteBookingCart 
                            roomSuitesCart={roomSuitesCart} 
                            onRemoveRoomsSuitesItemFromCart={removeRoomsSuitesItemFromCartDb}
                        />
                    }

                    {(diningCart !== null && diningCart.length > 0) &&
                        <UserDiningBookingCart 
                            diningCart={diningCart} 
                            onRemoveDiningItemFromCart={removeDiningItemFromCartDb}
                        />
                    }

                    {(eventMeetingCart !== null && eventMeetingCart.length > 0) &&
                        <UserEventMeetingBookingCart 
                            eventMeetingCart={eventMeetingCart} 
                            onRemoveEventMeetingItemFromCart={removeEventMeetingItemFromCart}
                        />
                    }

                </div>

            </div>
        </React.Fragment>
    );
}


export default UserAllCartComponentPage;