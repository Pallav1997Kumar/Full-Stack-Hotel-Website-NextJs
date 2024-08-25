'use client'
import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import styles from './page.module.css';

import DiningBookingCartComponent from "@/components/Carts Component/DiningBookingCartComponent.jsx";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from '@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice';
import { deleteParticularBookingFromDiningCart } from '@/redux store/features/Booking Features/diningBookingCartSlice';


export default function page(){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const allDiningBookingCart = useAppSelector((reduxStore) => reduxStore.diningCartSlice.diningCart);

    const loginUserIdDetails = useAppSelector((reduxStore) => reduxStore.userSlice.loginUserDetails);
    let loginUserId = null;
    if(loginUserIdDetails != null){
        loginUserId = loginUserIdDetails.userId;
    }

    const [informationAddingToUserCart, setInformationAddingToUserCart] = useState(false);

    function loginButtonClickHandler(){
        const loginPageCalledFrom = 'Dining Cart Component';
        const loginRedirectPage = '/cart/dining-cart';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/login');
    }

    async function addAccountCart(){
        try {
            setInformationAddingToUserCart(true);
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
                            if(data.message === 'Cart Information Successfully Added To Cart'){
                                dispatch(deleteParticularBookingFromDiningCart(eachDiningCart.diningCartId));
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

            <DiningBookingCartComponent />

            {(allDiningBookingCart.length > 0 && loginUserId === null) && 
                <div className={styles.loginBtnContainer}>
                    <Button onClick={loginButtonClickHandler} variant="contained"> Please Login For Booking </Button>
                </div>
            }

            {(allDiningBookingCart.length > 0 && loginUserId !== null) &&
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