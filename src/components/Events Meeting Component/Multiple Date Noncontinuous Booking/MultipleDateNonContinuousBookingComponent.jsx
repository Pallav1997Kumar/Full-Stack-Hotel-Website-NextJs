'use client'
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/navigation';

import styles from "./MultipleDateNonContinuousBookingComponent.module.css";

import EachDateBookingComponent from "./EachDateBookingComponent.jsx";
import { getOnlyDate, getOnlyMonth, getOnlyYear, convertDateTextToDate } from "@/functions/date.js";
import { isAllElementsUniqueInArray } from "@/functions/array.js";
import { useAppDispatch, useAppSelector } from "@/redux store/hooks.js";
import { addNewBookingToEventMeetingCart } from "@/redux store/features/Booking Features/eventMeetingRoomBookingCartSlice.js";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from '@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice';
import { multipleNonContinousDatesEventsMeetingSelectionErrorConstants } from "@/constant string files/eventsMeetingSelectionErrorConstants.js";


function MultipleDateNonContinuousBookingComponent(props) {

    const loginUserIdDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    const meetingEventsInfoTitle = props.meetingEventsInfoTitle;
    const meetingEventsSeatingInfo = props.meetingEventsSeatingInfo;
    const roomBookingDateType = props.roomBookingDateType;
    const meetingEventAreaPath = props.meetingEventAreaPath;

    const dispatch = useAppDispatch();
    const router = useRouter();

    const [noOfDateForBooking, setNoOfDateForBooking] = useState(2);
    const [noOfDateForEventBooking,setNoOfDateForEventBooking] = useState(2);
    const [proceedErrorMessage, setProceedErrorMessage] = useState('');
    const [allDatesBookingInfo, setAllDatesBookingInfo] = useState([]);
    const [showValidateBlock, setShowValidateBlock] = useState(true);
    const [showDateContainer, setShowDateContainer] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [isDataSavingToCart, setIsDataSavingToCart] = useState(false);
    const [showSuccessfullyCartAddedBlock, setShowSuccessfullyCartAddedBlock] = useState(false);

    const isRoomAvailable = true;

    const dateNumberArray = [];
    for(let i = 1; i <= noOfDateForEventBooking; i++){
        dateNumberArray.push(i);
    }

    function proceedClickHandler(){
        if(noOfDateForBooking >= 2){
            setNoOfDateForEventBooking(noOfDateForBooking);
            setShowDateContainer(true);
            setProceedErrorMessage('');
        }
        else{
            setShowDateContainer(false);
            setProceedErrorMessage(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.INPUT_NOT_LESS_THAN_TWO);
        }
    }

    function validateClickHandler() {
        if(noOfDateForEventBooking == allDatesBookingInfo.length){
            const onlyDateFromAllDatesInfo = allDatesBookingInfo.map(function(eachInfo){
                const bookingdate = eachInfo.meetingEventBookingDate;
                const dateString = `${getOnlyDate(bookingdate)} ${getOnlyMonth(bookingdate)} ${getOnlyYear(bookingdate)}`;
                return dateString;
            });
            const isAllDatesUnique = isAllElementsUniqueInArray(onlyDateFromAllDatesInfo);
            if(isAllDatesUnique){
                setValidationError('');
                setShowValidateBlock(false);
            }
            else{
                setValidationError(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.MULTIPLE_SAME_DATES_CHOOSEN);
            }
        }
        else{
            setValidationError(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.ALL_DATES_INPUT_NOT_CHOOSEN);
        }
        
        
    }

    function getRoomBookingInfo(newRoomBookingInfo) {
        const isSameDateNumberPresent = allDatesBookingInfo.some(function(eachInfo){
            return (eachInfo.dateNumber == newRoomBookingInfo.dateNumber)
        });
        if(isSameDateNumberPresent){
            const oldRoomBookingInfoDifferentDateNo = allDatesBookingInfo.filter(function(eachInfo){
                return (eachInfo.dateNumber != newRoomBookingInfo.dateNumber)
            });
            setAllDatesBookingInfo([...oldRoomBookingInfoDifferentDateNo, newRoomBookingInfo]);
        }
        else{
            setAllDatesBookingInfo([...allDatesBookingInfo, newRoomBookingInfo]);
        }        
    }

    function addCartHandler() {
        const allDatesBookingInformation = allDatesBookingInfo.map(function(eachDate){
            const eachDateInfo = JSON.parse(JSON.stringify(eachDate));
            eachDateInfo.meetingEventBookingDate = convertDateTextToDate(eachDate.meetingEventBookingDate).toString();
            return eachDateInfo;
        });
        let totalPriceOfAllDates = 0;
        allDatesBookingInformation.forEach(function(eachDate){
            totalPriceOfAllDates = totalPriceOfAllDates + eachDate.totalPriceEventMeetingRoom;
        });
        setIsDataSavingToCart(true);
        const bookingDetails = {
            eventCartId: Date.now(),
            roomBookingDateType,
            meetingEventsInfoTitle,
            totalPriceOfAllDates,
            allDatesBookingInformation
        }
        console.log(bookingDetails);
        if(loginUserIdDetails === null){
            dispatch(addNewBookingToEventMeetingCart(bookingDetails));
            setShowSuccessfullyCartAddedBlock(true);
            setIsDataSavingToCart(false);
        }
        if(loginUserIdDetails !== null){
            addToDatabaseCartHandler(bookingDetails);
        }
    }

    async function addToDatabaseCartHandler(bookingDetails) {
        try {
            const loginUserId = loginUserIdDetails.userId;
            const response = await fetch(`/api/add-cart/meeting-events/multiple-dates-non-continous/${loginUserId}`, {
                method: 'POST',
                body: JSON.stringify(bookingDetails),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data = await response.json();
            if(response.status === 200){
                if(data.message === 'Cart Information Successfully Added To Cart'){
                    setShowSuccessfullyCartAddedBlock(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
        finally{
            setIsDataSavingToCart(false);
        }
    }


    function loginButtonClickHandler(event){
        event.preventDefault();
        const loginPageCalledFrom = `Event Meeting Room/ ${meetingEventsInfoTitle} Page`;
        const loginRedirectPage = `/meetings-events/${meetingEventAreaPath}`;
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/login');
    }


    return (
        <div className={styles.multipleDateNonContinuousBookContainer}>
            <form>
                <div className={styles.dateNumberContainer}>
                    <label htmlFor="no-of-date">
                        <div className={styles.dateNumberQues}>Please Enter for How many Dates you want to Booking Event/Meeting Room</div>
                    </label>
                    <input 
                        id="no-of-date" 
                        type="number"
                        min="2"
                        className={styles.dateNumberAns}
                        value={noOfDateForBooking} 
                        onChange={(event)=> setNoOfDateForBooking(event.target.value)}
                    />
                </div>
                <div className={styles.proceedBtnContainer}>
                    {proceedErrorMessage != '' &&
                    <p className={styles.errorMessage}>{proceedErrorMessage}</p>
                    }
                    <Button onClick={proceedClickHandler}>Proceed</Button>
                </div>
                {showDateContainer &&
                    <div>
                        {dateNumberArray.map(function(eachDate){
                            return (
                                <EachDateBookingComponent 
                                    key={eachDate} 
                                    meetingEventsInfoTitle={meetingEventsInfoTitle} 
                                    meetingEventsSeatingInfo={meetingEventsSeatingInfo} 
                                    dateNumber={eachDate} 
                                    onGetRoomBookingInfo={getRoomBookingInfo}
                                />
                            )
                        })}
                    </div>
                }
                {(showValidateBlock && showDateContainer) &&
                    <div className={styles.buttonContainer}>
                        <p className={styles.errorMessage}>{validationError}</p>
                        <br />
                        <Button onClick={validateClickHandler} variant="contained">Validate the Choosen Date/Time</Button>
                    </div>
                }
                {(!showValidateBlock && isRoomAvailable && !showSuccessfullyCartAddedBlock) &&
                    <div className={styles.buttonContainer}>
                        <p className={styles.roomAvailableMessage}>The Meeting and Event Room is available in choosen Date and Time Slot.</p>
                        <br />
                        
                        {!isDataSavingToCart &&
                        <Button onClick={addCartHandler} variant="contained">Add to Cart</Button>
                        }

                        {isDataSavingToCart &&
                        <Button variant="contained" disabled>Please Wait</Button>
                        }
                    </div>
                }
                {(!showValidateBlock && !isRoomAvailable) &&
                    <div className={styles.buttonContainer}>
                        <p className={styles.errorMessage}>The Meeting and Event Room is not available in choosen Date and Time Slot.</p>
                        <br />
                        <Button variant="contained">Close</Button>
                    </div>
                }
                {showSuccessfullyCartAddedBlock &&
                <div className={styles.successfullyCartAdded}>
                    <p>The Event/ Meeting Room Successfully Added to Cart </p>
                </div>
                }
            </form>

            {(loginUserIdDetails === null) &&
                <div className={styles.loginContainer}>
                    <Button onClick={loginButtonClickHandler} variant="contained">Proceed to Login</Button>
                </div>
            }

        </div>
    );
}

export default MultipleDateNonContinuousBookingComponent;