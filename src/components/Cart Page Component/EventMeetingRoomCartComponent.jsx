'use client'
import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import styles from './DiningRoomEventMeetingStyle.module.css';

import EventMeetingRoomBookingCartComponent from "@/components/Carts Component/EventMeetingRoomBookingCartComponent.jsx";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from '@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice';
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";
import { INFORMATION_ADD_TO_CART_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";


function EventMeetingRoomCartComponent(){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const allEventMeetingBookingCart = useAppSelector((reduxStore) => reduxStore.eventMeetingCartSlice.eventMeetingCart);

    const loginUserIdDetails = useAppSelector((reduxStore) => reduxStore.userSlice.loginUserDetails);
    let loginUserId = null;
    if(loginUserIdDetails != null){
        loginUserId = loginUserIdDetails.userId;
    }

    const [informationAddingToUserCart, setInformationAddingToUserCart] = useState(false);

    function loginButtonClickHandler(){
        const loginPageCalledFrom = 'Event Meeting Room Cart Component';
        const loginRedirectPage = '/cart/events-meeting-room-cart';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/login');
    }

    async function addAccountCart(){
        try {
            setInformationAddingToUserCart(true);
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
        finally{
            setInformationAddingToUserCart(false);
        }
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
                    <Link href="/cart"> 
                        <span className={styles.breadcrumbsLink}> MY CARTS </span>
                    </Link>
                    <span>{'>>'}</span> 
                    <Link href="/cart/events-meeting-room-cart"> 
                        <span className={styles.breadcrumbsLink}> MY EVENT AND MEETING ROOMS CARTS </span>
                    </Link>
                </p>
            </div>

            <EventMeetingRoomBookingCartComponent />

            {(allEventMeetingBookingCart.length > 0 && loginUserId === null) && 
                <div className={styles.loginBtnContainer}>
                    <Button onClick={loginButtonClickHandler} variant="contained"> Please Login For Booking </Button>
                </div>
            }

            {(allEventMeetingBookingCart.length > 0 && loginUserId !== null) &&
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
    );
}

export default EventMeetingRoomCartComponent;