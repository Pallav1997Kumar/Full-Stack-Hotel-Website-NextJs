'use client'
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import styles from "./MultipleDateNonContinuousBookingComponent.module.css";

import EachDateBookingComponent from "./EachDateBookingComponent.jsx";
import { getOnlyDate, getOnlyMonth, getOnlyYear, convertDateTextToDate } from "@/functions/date.js";
import { isAllElementsUniqueInArray } from "@/functions/array.js";
import { useAppDispatch } from "@/redux store/hooks.js";
import { addNewBookingToEventMeetingCart } from "@/redux store/features/Booking Features/eventMeetingRoomBookingCartSlice.js";


function MultipleDateNonContinuousBookingComponent(props) {
    const meetingEventsInfoTitle = props.meetingEventsInfoTitle;
    const meetingEventsSeatingInfo = props.meetingEventsSeatingInfo;
    const roomBookingDateType = props.roomBookingDateType;
    const dispatch = useAppDispatch();

    const [noOfDateForBooking, setNoOfDateForBooking] = useState(2);
    const [noOfDateForEventBooking,setNoOfDateForEventBooking] = useState(2);
    const [proceedErrorMessage, setProceedErrorMessage] = useState('');
    const [allDatesBookingInfo, setAllDatesBookingInfo] = useState([]);
    const [showValidateBlock, setShowValidateBlock] = useState(true);
    const [showDateContainer, setShowDateContainer] = useState(false);
    const [validationError, setValidationError] = useState('');
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
            setProceedErrorMessage('Number of input cannot be less than 2');
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
                setValidationError('You have not Choosen Two or More Same Dates');
            }
        }
        else{
            setValidationError('You have not Choosen Inputs for all the Dates');
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
        const bookingDetails = {
            eventCartId: Date.now(),
            roomBookingDateType,
            meetingEventsInfoTitle,
            totalPriceOfAllDates,
            allDatesBookingInformation
        }
        console.log(bookingDetails);
        dispatch(addNewBookingToEventMeetingCart(bookingDetails));
        setShowSuccessfullyCartAddedBlock(true);
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
                        <Button onClick={addCartHandler} variant="contained">Add to Cart</Button>
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
        </div>
    );
}

export default MultipleDateNonContinuousBookingComponent;