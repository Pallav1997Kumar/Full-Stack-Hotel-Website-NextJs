'use client'
import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import styles from './DiningRoomEventMeetingStyle.module.css';

import RoomsBookingCartComponent from "@/components/Carts Component/RoomsBookingCartComponent.jsx";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from '@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice';
import { deleteParticularBookingFromRoomCart } from '@/redux store/features/Booking Features/roomBookingCartSlice';
import { INFORMATION_ADD_TO_CART_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";


function RoomsSuitesCartComponent(){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const allRoomBookingCart = useAppSelector((reduxStore) => reduxStore.roomCartSlice.roomCart);

    const loginUserIdDetails = useAppSelector((reduxStore) => reduxStore.userSlice.loginUserDetails);
    let loginUserId = null;
    if(loginUserIdDetails != null){
        loginUserId = loginUserIdDetails.userId;
    }

    const [informationAddingToUserCart, setInformationAddingToUserCart] = useState(false);

    function loginButtonClickHandler(){
        const loginPageCalledFrom = 'Rooms and Suites Cart Component';
        const loginRedirectPage = '/cart/rooms-and-suites-cart';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/login');
    }

    async function addAccountCart(){
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
                    <Link href="/cart/rooms-and-suites-cart"> 
                        <span className={styles.breadcrumbsLink}> MY ROOMS AND SUITES CARTS </span>
                    </Link>
                </p>
            </div>

            <RoomsBookingCartComponent />

            {(allRoomBookingCart.length > 0 && loginUserId === null) && 
                <div className={styles.loginBtnContainer}>
                    <Button onClick={loginButtonClickHandler} variant="contained"> Please Login For Booking </Button>
                </div>
            }

            {(allRoomBookingCart.length > 0 && loginUserId !== null) &&
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

export default RoomsSuitesCartComponent;