'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Button from '@mui/material/Button';
import Image from 'next/image';

import styles from './page.module.css';

import { useAppSelector } from "@/redux store/hooks";
import UserRoomSuiteBookingCart from "@/components/User Carts Component/UserRoomSuiteBookingCart.jsx";


export default function Page(){

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
                if(data.message === 'Rooms and Suites Cart is Empty!'){
                    const roomSuitesCartDb = null;
                    setRoomSuitesCart(roomSuitesCartDb);
                }
                else if(data.message === 'Rooms and Suites Present in Cart!'){
                    const roomSuitesCartDb = data.roomSuiteCartInfo;
                    setRoomSuitesCart(roomSuitesCartDb);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    if(roomSuitesCart === null){
        return (
            <React.Fragment>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />
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
            {(roomSuitesCart !== null && roomSuitesCart.length > 0) &&
                <UserRoomSuiteBookingCart roomSuitesCart={roomSuitesCart} />
            }
        </div>
    );

}