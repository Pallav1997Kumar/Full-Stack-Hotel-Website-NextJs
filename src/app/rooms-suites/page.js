import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from "./page.module.css";

import Rooms from "@/components/Rooms Component/Rooms.jsx";


export function generateMetadata(){
    return {
        title: 'Rooms And Suites'
    }
}


export default async function Page(){

    const roomSuitesInfo = await fetchRoomsSuitesInformation();
    const roomsSuites = roomSuitesInfo.rooms;

    
    return (
        <React.Fragment>
            <div className={styles.imageContainer}>
                <Image src={'/Room Photo/Room-Generic.jpg'} alt="room image" width={1400} height={500} />
            </div>

            <div className={styles.breadcrumbsContainer}>
                <p>
                    <Link href="/">
                        <span className={styles.breadcrumbsLink}> HOME </span>
                    </Link> 
                    <span>{'>>'}</span> 
                    <Link href="/rooms-suites"> 
                        <span className={styles.breadcrumbsLink}> ROOMS AND SUITES </span>
                    </Link>
                </p>
            </div>

            <div className={styles.descriptionContainer}>
                <h2>ROOMS AND SUITES</h2>
                <p>For your safety and comfort we have put in place strict measures adhering to both governmental requirements and sanitary guidelines.</p>
                <p>Our rooms and suites have been thoughtfully designed for business and leisure travellers to Kolkata; with classic furnishings, heritage style design features, modern technologies and 24 hour services.</p>
            </div>
            <div>
                {roomsSuites.map(function(roomSuite){
                    return (
                        <Rooms 
                            title={roomSuite.title} 
                            intro={roomSuite.intro} 
                            path={roomSuite.path}
                            description={roomSuite.description} 
                            totalRoomSize={roomSuite.totalRoomSize} 
                            coverPhoto={roomSuite.photos[0]} 
                        />
                    );
                })}
            </div>
        </React.Fragment>
    );
}


async function fetchRoomsSuitesInformation(){
    try {
        const response = await fetch(`${process.env.URL}/api/hotel-booking-information/room-and-suites-information/`);
        const roomSuitesInfo = await response.json();
        return roomSuitesInfo;
    } catch (error) {
        console.log(error);
    }
}