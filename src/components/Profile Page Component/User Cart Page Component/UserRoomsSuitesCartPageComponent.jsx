'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Button from '@mui/material/Button';
import Image from 'next/image';

import styles from './UserDiningRoomsSuitesEventMeetingStyle.module.css';

import { useAppSelector } from "@/redux store/hooks";
import UserRoomSuiteBookingCart from "@/components/User Carts Component/UserRoomSuiteBookingCart.jsx";
import { ROOMS_SUITES_PRESENT_IN_CART, ROOMS_SUITES_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";


function UserRoomsSuitesCartPageComponent(){

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    useEffect(()=>{
        fetchRoomSuiteCartDb(loginUserId);
    }, []);

    const [roomSuitesCart, setRoomSuitesCart] = useState(null);

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


    if(roomSuitesCart === null){
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
                        <Link href={`/profile-home-page/my-cart/rooms-suites/${loginUserId}`}> 
                            <span className={styles.breadcrumbsLink}> MY ACCOUNT ROOMS AND SUITES CART </span>
                        </Link>
                    </p>
                </div>

                <div className={styles.emptyCart}>
                    <p>Rooms And Suites Cart is Empty</p>
                    <p>Click on Below Button to Add Items</p>
                    <Link href={`/rooms-suites/`} passHref>
                        <Button variant="contained">Rooms And Suites Page</Button>
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

            {(roomSuitesCart !== null && roomSuitesCart.length > 0) &&
                <UserRoomSuiteBookingCart 
                    roomSuitesCart={roomSuitesCart} 
                    onRemoveRoomsSuitesItemFromCart={removeRoomsSuitesItemFromCartDb}
                />
            }
        </div>
    );

}

export default UserRoomsSuitesCartPageComponent;