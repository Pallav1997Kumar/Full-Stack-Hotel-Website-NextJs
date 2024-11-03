'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';

import styles from './UserCurrentDiningRoomEventPage.module.css';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { ROOMS_SUITES_BOOKING_INFO_IS_PRESENT, ROOMS_SUITES_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import UserRoomsSuitesBookingComponent from "@/components/User Current Booking Component/UserRoomsSuitesBookingComponent.jsx";


function UserCurrentRoomsSuitesBookingPage(){

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    const [loadingBookingDetails, setLoadingBookingDetails] = useState(true);

    const [roomSuitesBooking, setRoomSuitesBooking] = useState(null);

    useEffect(()=>{
        fetchRoomSuiteBookingDb(loginUserId);
    }, []);

    async function fetchRoomSuiteBookingDb(loginUserId) {
        try {
            const response = await fetch(`/api/view-current-booking/rooms-suites/${loginUserId}`);
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
                    <Link href={`/profile-home-page/view-current-bookings/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> VIEW CURRENT OR UPCOMING BOOKINGS </span>
                    </Link>
                    <span>{'>>'}</span>
                    <Link href={`/profile-home-page/view-current-bookings/rooms-suites/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> ROOMS AND SUITES BOOKING </span>
                    </Link>
                </p>
            </div>

            {loadingBookingDetails &&
                <div className={styles.loadingBookingDetails}>
                    <p> LOADING ROOMS AND SUITES BOOKING DETAILS...</p>
                </div>
            }

            <div className={styles.diningRoomsEventContainer}>
                {(!loadingBookingDetails && roomSuitesBooking !== null && roomSuitesBooking.length == 0) &&
                    <div className={styles.emptyBooking}>
                        <p>You do not have any Current or Future Upcoming Rooms and Suites Bookings</p>
                    </div>
                }

                {(!loadingBookingDetails && roomSuitesBooking !== null && roomSuitesBooking.length > 0) &&
                    <UserRoomsSuitesBookingComponent roomSuitesBookingInfo={roomSuitesBooking} />
                }
            </div>

        </div>
    );

}


export default UserCurrentRoomsSuitesBookingPage;