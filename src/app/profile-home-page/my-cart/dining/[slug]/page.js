'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Button from '@mui/material/Button';
import Image from 'next/image';

import styles from './page.module.css';

import { useAppSelector } from "@/redux store/hooks";
import UserDiningBookingCart from "@/components/User Carts Component/UserDiningBookingCart.jsx";


export default function Page(){

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


    if(diningCart === null){
        return (
            <React.Fragment>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />
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
            {(diningCart !== null && diningCart.length > 0) &&
                <UserDiningBookingCart diningCart={diningCart} />
            }
        </div>
    );

}