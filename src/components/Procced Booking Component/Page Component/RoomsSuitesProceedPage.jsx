'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import styles from './RoomsSuitesProceedPage.module.css';

import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import RoomSuitesBookingInfo from "@/components/Booking Information Component/Rooms Suites Booking/RoomSuitesBookingInfo.jsx";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";
import { ROOMS_SUITES_BOOKING_PROCESS_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";
import { resetRoomSuiteBookingInfo } from "@/redux store/features/Booking Information/roomSuiteBookingInfoSlice.js";


function RoomsSuitesProceedPage(props){
    const dispatch = useAppDispatch();

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

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

    const roomsSuitesBookingAmount = allRoomSuiteBookingInfo.reduce(function(total, eachRoomSuiteBookingInfo){
        return total + eachRoomSuiteBookingInfo.cartInfo.totalPriceOfAllRooms;
    }, 0);

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

    async function payRoomsSuitesBookingAmount(){
        try{
            setPerformingPayment(true);
            const response = await fetch('/api/booking-bulk-activities/rooms-suites-booking-activities/', {
                method: 'POST',
                body: JSON.stringify(allRoomSuiteBookingInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data = await response.json();
            if(response.status === 200 && data.message === ROOMS_SUITES_BOOKING_PROCESS_SUCCESSFUL){
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

            <div className={styles.roomSuiteBookingInfo}>
                <RoomSuitesBookingInfo allRoomSuiteBookingInfo={allRoomSuiteBookingInfo} />
            </div>

            <div className={styles.proceedBtn}>
                {(allRoomSuiteBookingInfo.length > 0 && loginCustomerInfo !== null) &&
                    <Button onClick={()=>setShowPaymentContainer(true)} variant="contained">
                        Proceed For Booking
                    </Button>
                }
                {(allRoomSuiteBookingInfo.length == 0 || loginCustomerInfo == null) &&
                    <Button disabled variant="contained">
                        Proceed For Booking
                    </Button>
                }
            </div>

            {showPaymentContainer && 
            <div className={styles.paymentContainer}>
                <p className={styles.paymentAmount}>Please Pay {CURRENCY_SYMBOL}{roomsSuitesBookingAmount } for Rooms and Suites Booking</p>
                {(roomsSuitesBookingAmount <= customerAccountBalance) && 
                    <div className={styles.sufficientBalance}>
                        <p>Your Account has Balance {CURRENCY_SYMBOL}{customerAccountBalance}</p>
                        {!performingPayment &&
                            <Button onClick={payRoomsSuitesBookingAmount} variant="contained">
                                Pay {CURRENCY_SYMBOL}{roomsSuitesBookingAmount}
                            </Button>
                        }
                        {performingPayment &&
                            <Button disabled variant="contained">
                                Please Wait
                            </Button>
                        }
                    </div>    
                }
                {(roomsSuitesBookingAmount > customerAccountBalance) && 
                    <div className={styles.insufficientBalance}>
                        <p>
                            <FontAwesomeIcon icon={faCircleExclamation} />Warning: Your Account has Insufficient Balance. Current Balance in Account is {CURRENCY_SYMBOL}{customerAccountBalance}. Please add {CURRENCY_SYMBOL}{roomsSuitesBookingAmount - customerAccountBalance} to your Account.
                        </p>
                        <Button disabled variant="contained">
                            Pay {CURRENCY_SYMBOL}{roomsSuitesBookingAmount}
                        </Button>
                    </div>
                }
            </div>
            }

        </div>
    );
}

export default RoomsSuitesProceedPage;