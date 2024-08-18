import React from "react";
import Image from 'next/image';
import Link from 'next/link';

import styles from "./EventsMeetingComponent.module.css";


async function EventsMeetingComponent(){

    const meetingEventsRooms = await fetchMeetingEventsRoomInformation();
    const threeEventsRooms = meetingEventsRooms.slice(0,3)

    return (
        <div className={styles.eventsContainer}>
            <h2>Events and Meeting Rooms</h2>
            <div className={styles.eventsOnlyContainer}>
                <Link href={`/meetings-events/`} passHref>
                    <p className={styles.seeMore}>SEE ALL THE EVENTS ROOMS OPTIONS</p>
                </Link>
                <div className={styles.events}>
                    {threeEventsRooms.map(function(eachEventRoom){
                        return(
                            <div className={styles.eachEventStyle}>
                                <Image src={eachEventRoom.meetingEventAreaImage} alt="room-photo" width={375} height={300} />
                                <Link href={`/meetings-events/${eachEventRoom.meetingEventAreaPath}`} passHref>
                                    <h4>{eachEventRoom.meetingEventAreaTitle}</h4>
                                </Link>
                                <p>{eachEventRoom.meetingEventAreaShortDescription}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}


async function fetchMeetingEventsRoomInformation(){
    try {
        const response = await fetch(`${process.env.URL}/api/hotel-booking-information/events-meeting-room-information/`);
        const meetingEventRoomInfo = await response.json();
        const meetingEventsRooms = meetingEventRoomInfo.meetingEventsRooms;
        return meetingEventsRooms;
    } catch (error) {
        console.log(error);
    }
}


export default EventsMeetingComponent;