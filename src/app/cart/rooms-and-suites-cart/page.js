'use client'
import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import styles from './page.module.css';

import RoomsBookingCartComponent from "@/components/Carts Component/RoomsBookingCartComponent.jsx";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from '@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice';
import { deleteParticularBookingFromRoomCart } from '@/redux store/features/Booking Features/roomBookingCartSlice';


export default function page(){

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
                            if(data.message === 'Cart Information Successfully Added To Cart'){
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