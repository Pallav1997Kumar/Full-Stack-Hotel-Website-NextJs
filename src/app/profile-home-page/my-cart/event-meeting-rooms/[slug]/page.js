'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Button from '@mui/material/Button';
import Image from 'next/image';

import styles from './page.module.css';

import { useAppSelector } from "@/redux store/hooks";
import UserEventMeetingBookingCart from "@/components/User Carts Component/UserEventMeetingBookingCart.jsx";


export default function Page(){

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


    if(eventMeetingCart === null){
        return (
            <React.Fragment>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />
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
            {(eventMeetingCart !== null && eventMeetingCart.length > 0) &&
                <UserEventMeetingBookingCart eventMeetingCart={eventMeetingCart} />
            }
        </div>
    );

}