'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';

import styles from './page.module.css';

import { useAppSelector } from "@/redux store/hooks";
import UserRoomSuiteBookingCart from "@/components/User Carts Component/UserRoomSuiteBookingCart.jsx";
import UserDiningBookingCart from "@/components/User Carts Component/UserDiningBookingCart.jsx";
import UserEventMeetingBookingCart from "@/components/User Carts Component/UserEventMeetingBookingCart.jsx";


export default function Page(){
    
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
                if(data.message === 'Rooms and Suites Cart is Empty!'){
                    const roomSuitesCartDb = null;
                    setRoomSuitesCart(roomSuitesCartDb);
                }
                else if(data.message === 'Rooms and Suites Present in Cart!'){
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
                if(data.message === 'Dining Cart is Empty!'){
                    const diningCartDb = null;
                    setDiningCart(diningCartDb);
                }
                else if(data.message === 'Dining Present in Cart!'){
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
                if(data.message === 'Event and Meeting Rooms Cart is Empty!'){
                    const eventMeetingCartDb = null;
                    setEventMeetingCart(eventMeetingCartDb);
                }
                else if(data.message === 'Event and Meeting Rooms Present in Cart!'){
                    const eventMeetingCartDb = data.eventMeetingCartInfo;
                    setEventMeetingCart(eventMeetingCartDb);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <React.Fragment>

            <div>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />
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
                        <UserRoomSuiteBookingCart roomSuitesCart={roomSuitesCart} />
                    }

                    {(diningCart !== null && diningCart.length > 0) &&
                        <UserDiningBookingCart diningCart={diningCart} />
                    }

                    {(eventMeetingCart !== null && eventMeetingCart.length > 0) &&
                        <UserEventMeetingBookingCart eventMeetingCart={eventMeetingCart} />
                    }

                </div>

            </div>
        </React.Fragment>
    );
}