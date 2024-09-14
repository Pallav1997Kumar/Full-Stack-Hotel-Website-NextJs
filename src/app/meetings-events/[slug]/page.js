import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from "./page.module.css";

import EventsMeetingBookingComponent from "@/components/Events Meeting Component/EventsMeetingBookingComponent.jsx";


export async function generateMetadata(context){
    const params = context.params
    const slug = params.slug;
    const currentEventMeetingAreaPath = slug;
    const meetingEventsInfo = await fetchCurrentMeetingEventsRoomInformation(currentEventMeetingAreaPath);
    const meetingEventAreaTitle = meetingEventsInfo.meetingEventAreaTitle;
    return {
        title: meetingEventAreaTitle,
    }
}

function getCurrentPageMeetingEventInfo(allMeetingEventsRooms, meetingEventsPath){
    const currentPageMeetingEventsInfo = allMeetingEventsRooms.find(function(eachMeetingEvents){
        return (eachMeetingEvents.meetingEventAreaPath === meetingEventsPath);
    });
    return currentPageMeetingEventsInfo; 
}

function getCurrentEventMeetingRoomArea(meetingEventsInfo){
    const onlyDimensionDetail = (meetingEventsInfo.meetingEventAreaInfo).find(function(eachInfo){
        return (eachInfo.meetingEventAreaInfoTitle === "Dimension")
    });
    const dimensionString = onlyDimensionDetail.meetingEventAreaInfoDetails;
    const eachLength = dimensionString.split("x");
    const length = eachLength[0].split("metre")[0].trim();
    const width = eachLength[1].split("metre")[0].trim();
    const area = length * width;
    return area;
}

async function fetchCurrentMeetingEventsRoomInformation(meetingEventsPath){
    try {
        const response = await fetch(`${process.env.URL}/api/hotel-booking-information/events-meeting-room-information/`);
        const meetingEventRoomInfo = await response.json();
        const meetingEventsRooms = meetingEventRoomInfo.meetingEventsRooms;
        const currentPageMeetingEvents = getCurrentPageMeetingEventInfo(meetingEventsRooms, meetingEventsPath);
        return currentPageMeetingEvents
    } catch (error) {
        console.log(error);
    }
}


async function Page(context){
    const slug = context.params.slug;
    const currentEventMeetingAreaPath = slug;
    const meetingEventsInfo = await fetchCurrentMeetingEventsRoomInformation(currentEventMeetingAreaPath);
    const meetingEventRoomArea = getCurrentEventMeetingRoomArea(meetingEventsInfo);

    return(
        <div className={styles.meetingEventsContainer}>

            <div className={styles.breadcrumbsContainer}>
                <p>
                    <Link href="/">
                        <span className={styles.breadcrumbsLink}> HOME </span>
                    </Link> 
                    <span>{'>>'}</span> 
                    <Link href="/meetings-events"> 
                        <span className={styles.breadcrumbsLink}> EVENTS AND MEETINGS </span>
                    </Link>
                    <span>{'>>'}</span> 
                    <Link href={`/meetings-events/${currentEventMeetingAreaPath}`}> 
                        <span className={styles.breadcrumbsLink}> {meetingEventsInfo.meetingEventAreaTitle} </span>
                    </Link>
                </p>
            </div>

            <h2>{meetingEventsInfo.meetingEventAreaTitle}</h2>

            <div className={styles.topContainer}>
                <div className={styles.imageContainer}>
                    <Image src={meetingEventsInfo.meetingEventAreaImage} alt="meeting-event" width={500} height={300} />
                </div>
                <div className={styles.meetingEventsInfoDetails}>
                    <p className={styles.meetingEventsShortDescription}>{meetingEventsInfo.meetingEventAreaShortDescription}</p>
                    <p className={styles.meetingEventsDescription}>{meetingEventsInfo.meetingEventAreaDescription}</p>
                    
                    
                    <div className={styles.meetingEventAreaInformationContainer}>
                        <h3>Meeting Event Room Area Information</h3>
                        <div className={styles.meetingEventAreaInformation}>
                            <div className={styles.meetingEventAreaInfoTitle}>Area</div>
                            <div className={styles.meetingEventAreaInfoDetails}>{meetingEventRoomArea} square metre</div>
                        </div>
                        
                        {(meetingEventsInfo.meetingEventAreaInfo).map(function(eachInfo){
                            return (
                                <div key={eachInfo.meetingEventAreaInfoTitle} className={styles.meetingEventAreaInformation}>
                                    <div className={styles.meetingEventAreaInfoTitle}>{eachInfo.meetingEventAreaInfoTitle}</div>
                                    <div className={styles.meetingEventAreaInfoDetails}>{eachInfo.meetingEventAreaInfoDetails}</div>
                                </div>
                            );
                        })}
                        
                    </div>

                </div>
            </div>

            <div className={styles.middleContainer}>
                <div className={styles.meetingEventAreaSeatingCapacityInfoContainer}>
                    <h3>Meeting Event Room Area Seating Capacity</h3>
                    {(meetingEventsInfo.meetingEventAreaSeatingCapacityInfo).map(function(eachSeatingArrangement){
                        return (
                            <div key={eachSeatingArrangement.meetingEventAreaSeatingTitle} className={styles.eachSeatingArrangement}>
                                <div className={styles.meetingEventAreaSeatingTitle}>{eachSeatingArrangement.meetingEventAreaSeatingTitle}</div>
                                <div className={styles.meetingEventAreaSeatingCapacity}>{eachSeatingArrangement.meetingEventAreaSeatingCapacity} persons</div>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.meetingEventAreaOtherConveniencesContainer}>
                    <p>OTHER CONVENIENCES</p>
                    {(meetingEventsInfo.meetingEventAreaOtherConveniences).map(function(eachConveniences){
                        return (<li key={eachConveniences}>{eachConveniences}</li>)
                    })}
                </div>
            </div>

            <div>
                <EventsMeetingBookingComponent 
                    meetingEventsInfoTitle={meetingEventsInfo.meetingEventAreaTitle} 
                    meetingEventsSeatingInfo={meetingEventsInfo.meetingEventAreaSeatingCapacityInfo} 
                    meetingEventAreaPath ={meetingEventsInfo.meetingEventAreaPath} 
                />
            </div>

        </div>
    );
}


export default Page;