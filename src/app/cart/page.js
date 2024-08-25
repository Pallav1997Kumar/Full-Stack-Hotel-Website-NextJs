'use client'
import Image from 'next/image'
import React from "react";
import Link from 'next/link';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import { wrapper } from '@/redux store/storePersistance.js';

import styles from "./page.module.css";

import RoomsBookingCartComponent from "@/components/Carts Component/RoomsBookingCartComponent.jsx";
import DiningBookingCartComponent from "@/components/Carts Component/DiningBookingCartComponent.jsx";
import EventMeetingRoomBookingCartComponent from "@/components/Carts Component/EventMeetingRoomBookingCartComponent.jsx";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from '@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice';


export default function Page(){

    const dispatch = useDispatch();

    const allRoomBookingCart = useSelector((reduxStore) => reduxStore.roomCartSlice.roomCart);
    const allDiningBookingCart = useSelector((reduxStore) => reduxStore.diningCartSlice.diningCart);
    const allEventMeetingBookingCart = useSelector((reduxStore) => reduxStore.eventMeetingCartSlice.eventMeetingCart);

    const loginUserIdDetails = useSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    let loginUserId = null;
    if(loginUserIdDetails != null){
        loginUserId = loginUserIdDetails.loginUserId;
    }


    function loginButtonClickHandler(){
        const loginPageCalledFrom = 'Navigation Bar';
        const loginRedirectPage = '/profile-home-page';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
    }


    return(
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
                            <Link href="/cart/rooms-and-suites-cart">Rooms & Suites Cart</Link>
                        </li>
                        <li>
                            <Link href="/cart/dining-cart">Dining Cart</Link>
                        </li>
                        <li>
                            <Link href="/cart/events-meeting-room-cart">Events/ Meeting Rooms Cart</Link>
                        </li>
                    </ol>
                </div>
                <div className={styles.allCart}>
                    <h3>All Carts</h3>
                    {(allRoomBookingCart.length == 0 && allDiningBookingCart.length == 0 && allEventMeetingBookingCart.length == 0) &&
                        <div className={styles.emptyCart}>
                            <p>Your Cart is Empty</p>
                            <p>Add Items in Your Cart</p>
                        </div>
                    }

                    {(allRoomBookingCart.length > 0) &&
                    <RoomsBookingCartComponent />
                    }

                    {(allDiningBookingCart.length > 0) &&
                    <DiningBookingCartComponent />
                    }

                    {(allEventMeetingBookingCart.length > 0) &&
                    <EventMeetingRoomBookingCartComponent />
                    }

                    {(loginUserId == null 
                        && (allEventMeetingBookingCart.length > 0 
                            || allDiningBookingCart.length > 0 
                            || allRoomBookingCart.length > 0)) &&
                        <div className={styles.loginBtnContainer}>
                            <Link href={`/login`} passHref>
                                <Button onClick={loginButtonClickHandler} variant="contained"> Please Login For Booking </Button>
                            </Link>
                        </div>
                    }

                    {(loginUserId != null 
                        && (allEventMeetingBookingCart.length > 0 
                            || allDiningBookingCart.length > 0 
                            || allRoomBookingCart.length > 0)) &&
                        <div className={styles.proceedBtnContainer}>
                            <Button variant="contained"> Proceed For Booking </Button>
                        </div>
                    }
                </div>
            </div>
        </React.Fragment>
    );
}