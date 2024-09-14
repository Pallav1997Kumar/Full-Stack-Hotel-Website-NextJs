import React from 'react';
import styles from "./page.module.css";
import Link from 'next/link';

import RoomBasicContainer from "@/components/Single Room Component/RoomBasicContainer.jsx";
import RoomAmenitiesContainer from "@/components/Single Room Component/RoomAmenitiesContainer.jsx";
import RoomImageGallery from "@/components/Single Room Component/RoomImageGallery.jsx";
import ContactUsContainer from "@/components/Single Room Component/ContactUsContainer.jsx";
import BookingRoomContainer from "@/components/Single Room Component/BookingRoomContainer.jsx";


export async function generateMetadata(context) {
    const params = context.params
    const slug = params.slug;
    const currentRoomPath = slug;
    const roomSuitesInfo = await fetchCurrentRoomData(currentRoomPath);
    const roomTitle = roomSuitesInfo.title;
    return {
        title: roomTitle,
    };
}

export async function fetchCurrentRoomData(currentRoomPath) {
    try {
        // Fetching all rooms and suites information
        const response = await fetch(`${process.env.URL}/api/hotel-booking-information/room-and-suites-information/`);
        const roomSuitesInfo = await response.json();
        const allRoomsInfo = roomSuitesInfo.rooms;

        // Find the current room suites information based on the path
        const currentRoomSuitesInfo = allRoomsInfo.find(function(eachRoom){
            return (eachRoom.path === currentRoomPath);
        });

        return currentRoomSuitesInfo;
    } catch (error) {
        console.error('Error fetching room and suite information:', error);
    }
}

// Main component to render the room information
async function Page(context) {
    const slug = context.params.slug;
    const currentRoomPath = slug; 
    const roomSuitesInfo = await fetchCurrentRoomData(currentRoomPath);


    return (
        <div className={styles.roomContainer}>

            <div className={styles.breadcrumbsContainer}>
                <p>
                    <Link href="/">
                        <span className={styles.breadcrumbsLink}> HOME </span>
                    </Link> 
                    <span>{'>>'}</span> 
                    <Link href="/rooms-suites"> 
                        <span className={styles.breadcrumbsLink}> ROOMS AND SUITES </span>
                    </Link>
                    <span>{'>>'}</span>
                    <Link href={`/rooms-suites/${currentRoomPath}`}> 
                        <span className={styles.breadcrumbsLink}> {roomSuitesInfo.title} </span>
                    </Link> 
                </p>
            </div>

            <h2>{roomSuitesInfo.title}</h2>
            <p className={styles.roomIntro}>{roomSuitesInfo.intro}</p>
            <RoomBasicContainer roomInfo={roomSuitesInfo} />
            <RoomAmenitiesContainer roomInfo={roomSuitesInfo} />
            <RoomImageGallery roomInfo={roomSuitesInfo} />
            <ContactUsContainer />
            <BookingRoomContainer roomInfo={roomSuitesInfo} />
        </div>
    );
}

export default Page;