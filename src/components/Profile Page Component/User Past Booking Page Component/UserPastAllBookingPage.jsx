'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';

import styles from './UserPastAllBookingPage.module.css';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { DINING_BOOKING_INFO_IS_PRESENT, DINING_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import { ROOMS_SUITES_BOOKING_INFO_IS_PRESENT, ROOMS_SUITES_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import { EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT, EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import UserAllBookingComponent from "@/components/User Current Booking Component/UserAllBookingComponent.jsx";


function UserPastAllBookingPage(){

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    const [loadingBookingDetails, setLoadingBookingDetails] = useState(true);

    const [roomSuitesBooking, setRoomSuitesBooking] = useState(null);
    const [diningBooking, setDiningBooking] = useState(null);
    const [eventMeetingBooking, setEventMeetingBooking] = useState(null);


    useEffect(()=>{
        fetchAllBookingDetails(loginUserId);
    }, []);


    let allBookingInfo = null;
    if(roomSuitesBooking != null && diningBooking != null && eventMeetingBooking != null){
        allBookingInfo = [...roomSuitesBooking, ...diningBooking, ...eventMeetingBooking];
    }


    async function fetchAllBookingDetails(loginUserId) {
        try {
            await fetchRoomSuiteBookingDb(loginUserId);
            await fetchDiningBookingDb(loginUserId);
            await fetchEventMeetingBookingDb(loginUserId);
        } 
        catch (error) {
            console.log(error);
        }
        finally{
            setLoadingBookingDetails(false);
        }
    }

    async function fetchRoomSuiteBookingDb(loginUserId) {
        try {
            const response = await fetch(`/api/view-past-booking/rooms-suites/${loginUserId}`);
            const data = await response.json();
            
            if(response.status === 200){
                if(data.message === ROOMS_SUITES_BOOKING_INFO_IS_EMPTY){
                    const roomSuitesBookingDb = [];
                    setRoomSuitesBooking(roomSuitesBookingDb);
                }
                else if(data.message === ROOMS_SUITES_BOOKING_INFO_IS_PRESENT){
                    const roomSuitesBookingDb = data.roomSuitesBookingInfo;
                    setRoomSuitesBooking(roomSuitesBookingDb);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchDiningBookingDb(loginUserId) {
        try {
            const response = await fetch(`/api/view-past-booking/dining/${loginUserId}`);
            const data = await response.json();
            if(response.status === 200){
                if(data.message === DINING_BOOKING_INFO_IS_EMPTY){
                    const diningBookingDb = [];
                    setDiningBooking(diningBookingDb);
                }
                else if(data.message === DINING_BOOKING_INFO_IS_PRESENT){
                    const diningBookingDb = data.diningBookingInfo;
                    setDiningBooking(diningBookingDb);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

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
    }

    
    return (
        <React.Fragment>

            <div>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />
            </div>

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
                </p>
            </div>

            <div className={styles.myBooking}>
                <h2>MY PAST BOOKINGS</h2>

                <div className={styles.categoryBooking}>
                    <h4>Category Wise Bookings</h4>
                    <ol>
                        <li>
                            <Link href={`/profile-home-page/view-past-bookings/rooms-suites/${loginUserId}`}>
                                Rooms & Suites Booking
                            </Link>
                        </li>
                        <li>
                            <Link href={`/profile-home-page/view-past-bookings/dining/${loginUserId}`}>
                                Dining Booking
                            </Link>
                        </li>
                        <li>
                            <Link href={`/profile-home-page/view-past-bookings/events-meeting-room/${loginUserId}`}>
                                Events/ Meeting Rooms Booking
                            </Link>
                        </li>
                    </ol>
                </div>

                <div className={styles.allBookings}>
                    <h3>All Bookings</h3>

                    {loadingBookingDetails &&
                        <div className={styles.loadingBookings}>
                            <p> LOADING BOOKING DETAILS ...</p>
                        </div>
                    }

                    {(!loadingBookingDetails &&
                        (roomSuitesBooking !== null && roomSuitesBooking.length == 0) && 
                        (diningBooking !== null && diningBooking.length == 0) && 
                        (eventMeetingBooking !== null && eventMeetingBooking.length == 0)) &&
                        <div className={styles.emptyBooking}>
                            <p>You do not have any Past Bookings</p>
                        </div>
                    }

                    {(allBookingInfo != null && allBookingInfo.length > 0) &&
                        <UserAllBookingComponent allBookingInfo={allBookingInfo} />
                    }


                </div>
                
            </div>

        </React.Fragment>
    );
}


export default UserPastAllBookingPage;