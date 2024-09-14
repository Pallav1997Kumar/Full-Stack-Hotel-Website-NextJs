import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from "./page.module.css";

import EventsMeetingsEachRoom from "@/components/Events Meeting Component/EventsMeetingsEachRoom.jsx";


export async function generateMetadata(){
    return {
        title: 'Events And Meeting'
    }
}


export default async function page(){

    const meetingEventRoomInfo = await fetchMeetingEventsRoomInformation();
    const meetingEventsRooms = meetingEventRoomInfo.meetingEventsRooms;

    return (
        <React.Fragment>
            <div className={styles.imageContainer}>
                <Image src={'/events-meeting/event meeting.jpg'} alt="meeting image" width={1400} height={500} />
            </div>

            <div className={styles.breadcrumbsContainer}>
                <p>
                    <Link href="/">
                        <span className={styles.breadcrumbsLink}> HOME </span>
                    </Link> 
                    <span>{'>>'}</span> 
                    <Link href="/meetings-events"> 
                        <span className={styles.breadcrumbsLink}> EVENTS AND MEETINGS </span>
                    </Link>
                </p>
            </div>

            <div className={styles.descriptionContainer}>
                <h2>EVENTS AND MEETINGS</h2>
                <p>From private meetings to grand corporate events, wedding anniversaries, engagements and birthday parties. When in Kolkata, it has to be The Oberoi Grand.</p>
                <p>At The Oberoi Grand, Kolkata, we can help you realise a perfect celebration. From birthdays to anniversaries and engagements, we have a venue to suit and the sincere hospitality to make your event simply unforgettable.</p>
                <p>The venue for Prime Ministerial and State conferences since the dawn of Independence, our corporate events are always impeccably executed; from planning and preparation to flawless delivery, with warm, intuitive service that brings an event to life.</p>
                <p>For meetings of up to twenty people, you can take your pick of our three board rooms. We also offer global translation services, upon request.</p>
            </div>
            <div>
                {meetingEventsRooms.map(function(eachEventsMeetings){
                    return (<EventsMeetingsEachRoom key={eachEventsMeetings.meetingEventAreaTitle} currentMeetingEvent={eachEventsMeetings} />)
                })}
            </div>
        </React.Fragment>
    );
}

async function fetchMeetingEventsRoomInformation(){
    try {
        const response = await fetch(`${process.env.URL}/api/hotel-booking-information/events-meeting-room-information/`);
        const meetingEventRoomInfo = await response.json();
        return meetingEventRoomInfo;
    } catch (error) {
        console.log(error);
    }
}