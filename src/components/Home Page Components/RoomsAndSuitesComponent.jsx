import React from "react";
import Image from 'next/image';
import Link from 'next/link';

import styles from "./RoomsAndSuitesComponent.module.css";


async function RoomsAndSuitesComponent(){

    const roomsSuites = await fetchRoomsSuitesInformation();
    const threeRooms = roomsSuites.slice(0,3);

    return (
        <div className={styles.roomsSuitesContainer}>
            <h2>Rooms and Suites</h2>
            <div className={styles.roomsSuitesOnlyContainer}>
                <Link href={`/rooms-suites/`} passHref>
                    <p className={styles.seeMore}>SEE ALL THE ROOMS OPTIONS</p>
                </Link>
                <div className={styles.roomsSuites}>
                    {threeRooms.map(function(eachRoom){
                        return(
                            <div className={styles.eachRoomStyle}>
                                <Image src={eachRoom.photos[0]} alt="room-photo" width={375} height={300} />
                                <Link href={`/rooms-suites/${eachRoom.path}`} passHref>
                                    <h4>{eachRoom.title}</h4>
                                </Link>
                                <p>{eachRoom.intro}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}


async function fetchRoomsSuitesInformation(){
    try {
        const response = await fetch(`${process.env.URL}/api/hotel-booking-information/room-and-suites-information/`);
        const roomSuitesInfo = await response.json();
        const roomsSuites = roomSuitesInfo.rooms;
        return roomsSuites;
    } catch (error) {
        console.log(error);
    }
}

export default RoomsAndSuitesComponent;