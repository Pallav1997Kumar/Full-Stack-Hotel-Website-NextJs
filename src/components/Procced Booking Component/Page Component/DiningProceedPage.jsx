'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import styles from './DiningProceedPage.module.css';

import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import DiningBookingInfo from "@/components/Booking Information Component/Dining Booking/DiningBookingInfo.jsx";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";
import { resetDiningBookingInfo } from "@/redux store/features/Booking Information/diningBookingInfoSlice.js";
import { DINING_BOOKING_PROCESS_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";


function DiningProceedPage(props){
    const dispatch = useAppDispatch();
    
    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    const allDiningBookingInfo = useAppSelector((reduxStore) => reduxStore.diningBookingInfoSlice.diningBookingInfo);

    useEffect(()=>{
        fetchLoginUsersDetailsDb(loginUserId);
    }, []);

    const [loginCustomerInfo, setLoginCustomerInfo] = useState(null);
    const [showPaymentContainer, setShowPaymentContainer] = useState(false);
    const [performingPayment, setPerformingPayment] = useState(false);

    const diningBookingAmount = allDiningBookingInfo.reduce(function(total, eachDiningBookingInfo) {
        return total + eachDiningBookingInfo.cartInfo.priceForBooking;
    }, 0);

    let customerAccountBalance = 0;
    if(loginCustomerInfo !== null){
        customerAccountBalance = loginCustomerInfo.accountBalance
    }

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

    async function payDiningBookingAmount(){
        try{
            setPerformingPayment(true);
            const response = await fetch('/api/booking-bulk-activities/dining-booking-activities/', {
                method: 'POST',
                body: JSON.stringify(allDiningBookingInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data = await response.json();
            if(response.status === 200 && data.message === DINING_BOOKING_PROCESS_SUCCESSFUL){
                dispatch(resetDiningBookingInfo());
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

            <div className={styles.diningBookingInfo}>
                <DiningBookingInfo allDiningBookingInfo={allDiningBookingInfo} />
            </div>

            <div className={styles.proceedBtn}>
                {(allDiningBookingInfo.length > 0 && loginCustomerInfo !== null) &&
                    <Button onClick={()=>setShowPaymentContainer(true)} variant="contained">
                        Proceed For Booking
                    </Button>
                }
                {(allDiningBookingInfo.length == 0 || loginCustomerInfo == null) &&
                    <Button disabled variant="contained">
                        Proceed For Booking
                    </Button>
                }
            </div>

            {showPaymentContainer && 
            <div className={styles.paymentContainer}>
                <p className={styles.paymentAmount}>Please Pay {CURRENCY_SYMBOL}{diningBookingAmount} for Dining Booking</p>
                {(diningBookingAmount <= customerAccountBalance) && 
                    <div className={styles.sufficientBalance}>
                        <p>Your Account has Balance {CURRENCY_SYMBOL}{customerAccountBalance}</p>
                        {!performingPayment &&
                            <Button onClick={payDiningBookingAmount} variant="contained">
                                Pay {CURRENCY_SYMBOL}{diningBookingAmount}
                            </Button>
                        }
                        {performingPayment &&
                            <Button disabled variant="contained">
                                Please Wait
                            </Button>
                        }
                    </div>    
                }
                {(diningBookingAmount > customerAccountBalance) && 
                    <div className={styles.insufficientBalance}>
                        <p>
                            <FontAwesomeIcon icon={faCircleExclamation} />Warning: Your Account has Insufficient Balance. Current Balance in Account is {CURRENCY_SYMBOL}{customerAccountBalance}. Please add {CURRENCY_SYMBOL}{diningBookingAmount - customerAccountBalance} to your Account.
                        </p>
                        <Button disabled variant="contained">
                            Pay {CURRENCY_SYMBOL}{diningBookingAmount}
                        </Button>
                    </div>
                }
            </div>
            }
            
        </div>
    );
}

export default DiningProceedPage;