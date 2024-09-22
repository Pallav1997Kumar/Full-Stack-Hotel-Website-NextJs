import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import Button from '@mui/material/Button';

import styles from "./Rooms.module.css";

import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


export default async function Rooms(props){

    const { title, intro, path , description, totalRoomSize, coverPhoto } = props;

    const roomsWithDateInformation = await fetchRoomsSuitesEachDayData(title);
    const dateDetailsOfRoom = roomsWithDateInformation.dateDetails;

    const startingPriceOfRoom = getRoomStartingPrice(dateDetailsOfRoom);

    function getRoomStartingPrice(dateDetailsOfParticularRoom) {
        dateDetailsOfParticularRoom.sort((a,b) => a.price - b.price);
        const minimumPriceDateDetails = dateDetailsOfParticularRoom[0];
        const minimumPrice = minimumPriceDateDetails.price;
        return minimumPrice;
    }

    return (
        <React.Fragment>
            <div className={styles.roomContainer}>
                <div className={styles.imageContainer}>
                    <Image src={coverPhoto} alt="room-cover-image" width={500} height={300} />
                </div>
                <div className={styles.roomDescriptionContainer}>
                    <h2>{title}</h2>
                    <p>{intro}</p>
                    <p>{description}</p>
                    <p><b>Total Room Size: </b>{totalRoomSize}</p>

                    <p className={styles.startingPrice}><b>Price Starting at {CURRENCY_SYMBOL}{startingPriceOfRoom} only </b></p>

                    <div className={styles.button}>
                        <div className={styles.explore}>
                            <Link href={`/rooms-suites/${path}`} passHref>
                                <Button variant="outlined">EXPLORE</Button>
                            </Link>
                        </div>
                        <div className={styles.book}>
                            <Button variant="contained">ADD TO CART</Button>
                        </div>                    
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}


async function fetchRoomsSuitesEachDayData(title){
    try{
        const response = await fetch(`${process.env.URL}/api/hotel-booking-information/room-and-suites-information/each-day-information/`);
        const data = await response.json();
        const allRoomsWithDate = data.roomsWithDate;
        const particularRoomEachDayInfo = allRoomsWithDate.find(function(eachRoomWithDate){
            return eachRoomWithDate.roomTitle == title
        });
        return particularRoomEachDayInfo;
    }
    catch(error){
        console.log(error);
    }
}