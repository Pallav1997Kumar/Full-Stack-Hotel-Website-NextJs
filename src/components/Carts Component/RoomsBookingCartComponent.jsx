'use client'
//import { useAppSelector } from "@/redux store/store.js";
import { useSelector } from 'react-redux';
import React from "react";
import Link from 'next/link';
import Button from '@mui/material/Button';

import styles from "./RoomsBookingCartComponent.module.css";

import EachRoomCartComponent from './EachRoomCartComponent.jsx';


function RoomsBookingCartComponent(props) {

    const allRoomBookingCart = useSelector((reduxStore) => reduxStore.roomCartSlice.roomCart);
    console.log(allRoomBookingCart);

    
    if(allRoomBookingCart.length == 0){
        return (
            <div className={styles.emptyCart}>
                <p>Rooms And Suites Cart is Empty</p>
                <p>Click on Below Button to Add Items</p>
                <Link href={`/rooms-suites/`} passHref>
                    <Button variant="contained">Rooms And Suites Page</Button>
                </Link>
            </div>
        );
    }


    return (
        <div className={styles.roomCartContainer}>
            {(allRoomBookingCart.length > 0) && allRoomBookingCart.map(function(eachRoomInCart){
                return(
                    <EachRoomCartComponent key={eachRoomInCart.roomCartId} eachRoomInCart={eachRoomInCart} />
                )
            })}
        </div>
    );
}

export default RoomsBookingCartComponent;