'use client'
import Image from 'next/image';
import React, { useState } from "react";
import Link from 'next/link';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import { wrapper } from '@/redux store/storePersistance.js';

import styles from "./AllCartsComponent.module.css";

import RoomsBookingCartComponent from "@/components/Carts Component/RoomsBookingCartComponent.jsx";
import DiningBookingCartComponent from "@/components/Carts Component/DiningBookingCartComponent.jsx";
import EventMeetingRoomBookingCartComponent from "@/components/Carts Component/EventMeetingRoomBookingCartComponent.jsx";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from '@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice';
import { deleteParticularBookingFromRoomCart } from '@/redux store/features/Booking Features/roomBookingCartSlice';
import { deleteParticularBookingFromDiningCart } from '@/redux store/features/Booking Features/diningBookingCartSlice';
import { deleteParticularBookingFromEventMeetingCart } from '@/redux store/features/Booking Features/eventMeetingRoomBookingCartSlice';
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";
import { INFORMATION_ADD_TO_CART_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";


function AllCartsComponent(){

    const dispatch = useDispatch();

    const allRoomBookingCart = useSelector((reduxStore) => reduxStore.roomCartSlice.roomCart);
    const allDiningBookingCart = useSelector((reduxStore) => reduxStore.diningCartSlice.diningCart);
    const allEventMeetingBookingCart = useSelector((reduxStore) => reduxStore.eventMeetingCartSlice.eventMeetingCart);

    const loginUserIdDetails = useSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    let loginUserId = null;
    if(loginUserIdDetails != null){
        loginUserId = loginUserIdDetails.userId;
    }

    const [informationAddingToUserCart, setInformationAddingToUserCart] = useState(false);


    function loginButtonClickHandler(){
        const loginPageCalledFrom = 'Cart Component';
        const loginRedirectPage = '/cart';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
    }

    async function addAccountCart() {
        try {
            setInformationAddingToUserCart(true);
            if(allRoomBookingCart.length > 0){
                allRoomBookingCart.forEach(async function(eachRoomCart){
                    try {
                        const response = await fetch(`/api/add-cart/rooms-suites/${loginUserId}`, {
                            method: 'POST',
                            body: JSON.stringify(eachRoomCart),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            }
                        });
                        const data = await response.json();
                        if(response.status === 200){
                            if(data.message === INFORMATION_ADD_TO_CART_SUCCESSFUL){
                                dispatch(deleteParticularBookingFromRoomCart(eachRoomCart.roomCartId));
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                });
            }

            if(allDiningBookingCart.length > 0){
                allDiningBookingCart.forEach(async function(eachDiningCart){
                    try {
                        const response = await fetch(`/api/add-cart/dining/${loginUserId}`, {
                            method: 'POST',
                            body: JSON.stringify(eachDiningCart),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            }
                        });
                        const data = await response.json();
                        if(response.status === 200){
                            if(data.message === INFORMATION_ADD_TO_CART_SUCCESSFUL){
                                dispatch(deleteParticularBookingFromDiningCart(eachDiningCart.diningCartId));
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                });
            }

            if(allEventMeetingBookingCart.length > 0){

                allEventMeetingBookingCart.forEach(async function(eachEventMeeting){

                    if(eachEventMeeting.roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE){
                        try {
                            const response = await fetch(`/api/add-cart/meeting-events/single-date/${loginUserId}`, {
                                method: 'POST',
                                body: JSON.stringify(eachEventMeeting),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                }
                            });
                            const data = await response.json();
                            if(response.status === 200){
                                if(data.message === INFORMATION_ADD_TO_CART_SUCCESSFUL){
                                    dispatch(deleteParticularBookingFromEventMeetingCart(eachEventMeeting.eventCartId));
                                }
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }

                    if(eachEventMeeting.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS){
                        try {
                            const response = await fetch(`/api/add-cart/meeting-events/multiple-dates-continous/${loginUserId}`, {
                                method: 'POST',
                                body: JSON.stringify(eachEventMeeting),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                }
                            });
                            const data = await response.json();
                            if(response.status === 200){
                                if(data.message === INFORMATION_ADD_TO_CART_SUCCESSFUL){
                                    dispatch(deleteParticularBookingFromEventMeetingCart(eachEventMeeting.eventCartId));
                                }
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }

                    if(eachEventMeeting.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS){
                        try {
                            const response = await fetch(`/api/add-cart/meeting-events/multiple-dates-non-continous/${loginUserId}`, {
                                method: 'POST',
                                body: JSON.stringify(eachEventMeeting),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                }
                            });
                            const data = await response.json();
                            if(response.status === 200){
                                if(data.message === INFORMATION_ADD_TO_CART_SUCCESSFUL){
                                    dispatch(deleteParticularBookingFromEventMeetingCart(eachEventMeeting.eventCartId));
                                }
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }

                });

            }

        } 
        catch (errorAccountAdd) {
            console.log(errorAccountAdd);
        }  
        finally {
            setInformationAddingToUserCart(false);
        }     
    }


    return(
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
                    <Link href="/cart"> 
                        <span className={styles.breadcrumbsLink}> MY CARTS </span>
                    </Link>
                </p>
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
                            {!informationAddingToUserCart && 
                                <Button onClick={addAccountCart} variant="contained"> 
                                    Add to Account Cart 
                                </Button>
                            }
                            {informationAddingToUserCart &&
                                <Button disabled variant="contained">Please Wait...</Button>
                            }
                        </div>
                    }
                </div>
            </div>
        </React.Fragment>
    );
}

export default AllCartsComponent;