'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';

import styles from './UserPastDiningRoomEventPage.module.css';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT, EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import UserEventMeetingBookingComponent from "@/components/User Current Booking Component/UserEventMeetingBookingComponent.jsx";


function UserPastEventMeetingBookingPage(){

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    const [loadingBookingDetails, setLoadingBookingDetails] = useState(true);

    const [eventMeetingBooking, setEventMeetingBooking] = useState(null);

    useEffect(()=>{
        fetchEventMeetingBookingDb(loginUserId);
    }, []);

    async function fetchEventMeetingBookingDb(loginUserId) {
        try {
            const response = await fetch(`/api/view-past-booking/meeting-events/${loginUserId}`);
            const data = await response.json();
            if(response.status === 200){
                if(data.message === EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY){
                    const eventMeetingBookingDb = [];
                    setEventMeetingBooking(eventMeetingBookingDb);
                }
                else if(data.message === EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT){
                    const eventMeetingBookingDb = data.eventMeetingBookingInfo;
                    setEventMeetingBooking(eventMeetingBookingDb);
                }
            }
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoadingBookingDetails(false);
        }
    }


    return (
        <div>
            <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

            <div className={styles.breadcrumbsContainer}>
                <p>
                    <Link href="/">
                        <span className={styles.breadcrumbsLink}> HOME </span>
                    </Link> 
                    <span>{'>>'}</span> 
                    <Link href="/profile-home-page"> 
                        <span className={styles.breadcrumbsLink}> PROFILE PAGE </span>
                    </Link>
                    <span>{'>>'}</span> 
                    <Link href={`/profile-home-page/view-past-bookings/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> VIEW PAST BOOKINGS </span>
                    </Link>
                    <span>{'>>'}</span>
                    <Link href={`/profile-home-page/view-past-bookings/events-meeting-room/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> EVENT/ MEETING ROOMS BOOKING </span>
                    </Link>
                </p>
            </div>

            {loadingBookingDetails &&
                <div className={styles.loadingBookingDetails}>
                    <p> LOADING EVENT/ MEETING ROOMS BOOKING DETAILS...</p>
                </div>
            }

            <div className={styles.diningRoomsEventContainer}>
                {(!loadingBookingDetails && eventMeetingBooking !== null && eventMeetingBooking.length == 0) &&
                    <div className={styles.emptyBooking}>
                        <p>You do not have any Past Events/ Meeting Room Bookings</p>
                    </div>
                }

                {(!loadingBookingDetails && eventMeetingBooking !== null && eventMeetingBooking.length > 0) &&
                    <UserEventMeetingBookingComponent eventMeetingBookingInfo={eventMeetingBooking} />
                }
            </div>

        </div>
    );

}


export default UserPastEventMeetingBookingPage;