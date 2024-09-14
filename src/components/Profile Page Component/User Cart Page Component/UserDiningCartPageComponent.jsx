'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Button from '@mui/material/Button';
import Image from 'next/image';

import styles from './UserDiningRoomsSuitesEventMeetingStyle.module.css';

import { useAppSelector } from "@/redux store/hooks";
import UserDiningBookingCart from "@/components/User Carts Component/UserDiningBookingCart.jsx";
import { DINING_PRESENT_IN_CART, DINING_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";


function UserDiningCartPageComponent(){

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    useEffect(()=>{
        fetchDiningCartDb(loginUserId);
    }, []);

    const [diningCart, setDiningCart] = useState(null);

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


    if(diningCart === null){
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
                        <Link href={`/profile-home-page/my-cart/dining/${loginUserId}`}> 
                            <span className={styles.breadcrumbsLink}> MY ACCOUNT DINING CART </span>
                        </Link>
                    </p>
                </div>

                <div className={styles.emptyCart}>
                    <p>Dining Cart is Empty</p>
                    <p>Click on Below Button to Add Items</p>
                    <Link href={`/dining/`} passHref>
                        <Button variant="contained">Dining Page</Button>
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
                    <Link href={`/profile-home-page/my-cart/dining/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> MY ACCOUNT DINING CART </span>
                    </Link>
                </p>
            </div>

            {(diningCart !== null && diningCart.length > 0) &&
                <UserDiningBookingCart 
                    diningCart={diningCart} 
                    onRemoveDiningItemFromCart={removeDiningItemFromCartDb}
                />
            }
        </div>
    );

}


export default UserDiningCartPageComponent;