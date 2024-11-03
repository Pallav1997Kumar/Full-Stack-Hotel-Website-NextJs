'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import styles from './AllComponentProceedPage.module.css';

import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import DiningBookingInfo from "@/components/Booking Information Component/Dining Booking/DiningBookingInfo.jsx";
import RoomSuitesBookingInfo from "@/components/Booking Information Component/Rooms Suites Booking/RoomSuitesBookingInfo.jsx";
import EventMeetingBookingInfo from "@/components/Booking Information Component/Event Meeting Booking/EventMeetingBookingInfo.jsx";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";
import { resetDiningBookingInfo } from "@/redux store/features/Booking Information/diningBookingInfoSlice.js";
import { resetEventMeetingBookingInfo } from "@/redux store/features/Booking Information/eventMeetingBookingInfoSlice.js";
import { resetRoomSuiteBookingInfo } from "@/redux store/features/Booking Information/roomSuiteBookingInfoSlice.js";
import { ROOMS_SUITES_DINING_EVENT_MEETING_ROOM_BOOKING_PROCESS_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";


function AllComponentProceedPage(){
    const dispatch = useAppDispatch();
    
    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    const allDiningBookingInfo = useAppSelector((reduxStore) => reduxStore.diningBookingInfoSlice.diningBookingInfo);
    const allEventMeetingBookingInfo = useAppSelector((reduxStore) => reduxStore.eventMeetingBookingInfoSlice.eventMeetingBookingInfo);
    const allRoomSuiteBookingInfo = useAppSelector((reduxStore) => reduxStore.roomSuiteBookingInfoSlice.roomSuiteBookingInfo);

    useEffect(()=>{
        fetchLoginUsersDetailsDb(loginUserId);
    }, []);

    const [loginCustomerInfo, setLoginCustomerInfo] = useState(null);
    const [showPaymentContainer, setShowPaymentContainer] = useState(false);
    const [performingPayment, setPerformingPayment] = useState(false);

    let customerAccountBalance = 0;
    if(loginCustomerInfo !== null){
        customerAccountBalance = loginCustomerInfo.accountBalance
    }
    
    let diningBookingAmount = 0;
    let eventMeetingBookingAmount = 0;
    let roomsSuitesBookingAmount = 0;

    if(allDiningBookingInfo.length > 0){
        diningBookingAmount = allDiningBookingInfo.reduce(function(total, eachDiningBookingInfo) {
            return total + eachDiningBookingInfo.cartInfo.priceForBooking;
        }, 0);
    }
    if(allEventMeetingBookingInfo.length > 0){
        eventMeetingBookingAmount = allEventMeetingBookingInfo.reduce(function(total, eachEventMeetingBookingInfo){
            return total + (eachEventMeetingBookingInfo.cartInfo.totalPriceEventMeetingRoom || eachEventMeetingBookingInfo.cartInfo.totalPriceOfAllDates || 0);
        }, 0);
    }
    if(allRoomSuiteBookingInfo.length > 0){
        roomsSuitesBookingAmount = allRoomSuiteBookingInfo.reduce(function(total, eachRoomSuiteBookingInfo){
            return total + eachRoomSuiteBookingInfo.cartInfo.totalPriceOfAllRooms;
        }, 0);
    }

    const allComponentTotalBookingAmount = diningBookingAmount + eventMeetingBookingAmount + roomsSuitesBookingAmount;


    async function fetchLoginUsersDetailsDb(loginUserId) {
        try {
            const response = await fetch(`/api/users-authentication/customers-authenticatication/login-user-information/${loginUserId}`);
            const data = await response.json();
            if(response.status == 200){
                setLoginCustomerInfo(data.loginUserDetails);   
            }
        } 
        catch (error) {
            console.log(error); 
        }
        finally{
            
        }
    }


    async function payAllComponentTotalBookingAmount(){
        try{
            const allComponentBookingInfo = {
                allDiningBookingInfo,
                allEventMeetingBookingInfo,
                allRoomSuiteBookingInfo
            }
            setPerformingPayment(true);
            const response = await fetch('/api/booking-bulk-activities/all-types-booking-activities/', {
                method: 'POST',
                body: JSON.stringify(allComponentBookingInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data = await response.json();
            if(response.status === 200 && data.message === ROOMS_SUITES_DINING_EVENT_MEETING_ROOM_BOOKING_PROCESS_SUCCESSFUL){
                dispatch(resetDiningBookingInfo());
                dispatch(resetEventMeetingBookingInfo());
                dispatch(resetRoomSuiteBookingInfo());
            }
        }
        catch (error) {
            console.log(error); 
        }
        finally{
            setPerformingPayment(false);
        }
    }


    return (
        <div>
            <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

            <div className={styles.allTypeBookingInfo}>
                <RoomSuitesBookingInfo allRoomSuiteBookingInfo={allRoomSuiteBookingInfo} />
                <DiningBookingInfo allDiningBookingInfo={allDiningBookingInfo} />
                <EventMeetingBookingInfo allEventMeetingBookingInfo={allEventMeetingBookingInfo} />
            </div>

            <div className={styles.proceedBtn}>
                {((allDiningBookingInfo.length > 0 || allRoomSuiteBookingInfo.length > 0 || allEventMeetingBookingInfo.length > 0) && loginCustomerInfo !== null) &&
                    <Button onClick={()=>setShowPaymentContainer(true)} variant="contained">
                        Proceed For Booking
                    </Button>
                }
                {((allDiningBookingInfo.length == 0 && allRoomSuiteBookingInfo.length == 0 && allEventMeetingBookingInfo.length == 0) || loginCustomerInfo == null) &&
                    <Button disabled variant="contained">
                        Proceed For Booking
                    </Button>
                }
            </div>

            {showPaymentContainer && 
            <div className={styles.paymentContainer}>
                <p className={styles.paymentAmount}>Please Pay {CURRENCY_SYMBOL}{allComponentTotalBookingAmount} for All Types of Booking</p>
                {(allComponentTotalBookingAmount <= customerAccountBalance) && 
                    <div className={styles.sufficientBalance}>
                        <p>Your Account has Balance {CURRENCY_SYMBOL}{customerAccountBalance}</p>
                        {!performingPayment &&
                            <Button onClick={payAllComponentTotalBookingAmount} variant="contained">
                                Pay {CURRENCY_SYMBOL}{allComponentTotalBookingAmount}
                            </Button>
                        }
                        {performingPayment &&
                            <Button disabled variant="contained">
                                Please Wait
                            </Button>
                        }
                    </div>    
                }
                {(allComponentTotalBookingAmount > customerAccountBalance) && 
                    <div className={styles.insufficientBalance}>
                        <p>
                            <FontAwesomeIcon icon={faCircleExclamation} />Warning: Your Account has Insufficient Balance. Current Balance in Account is {CURRENCY_SYMBOL}{customerAccountBalance}. Please add {CURRENCY_SYMBOL}{allComponentTotalBookingAmount - customerAccountBalance} to your Account.
                        </p>
                        <Button disabled variant="contained">
                            Pay {CURRENCY_SYMBOL}{allComponentTotalBookingAmount}
                        </Button>
                    </div>
                }
            </div>
            }

        </div>
    );
}

export default AllComponentProceedPage;