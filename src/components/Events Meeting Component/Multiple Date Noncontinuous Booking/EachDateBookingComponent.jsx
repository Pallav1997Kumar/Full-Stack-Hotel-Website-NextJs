'use client'
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import styles from "./EachDateBookingComponent.module.css";

import { convertDateTextToDate } from "@/functions/date.js";
import EventMeetingBookingsDetailsConfirmation from '@/components/Events Meeting Component/Common Components/EventMeetingBookingsDetailsConfirmation.jsx';
import PriceDetailsEachDate from "./PriceDetailsEachDate.jsx";
import { useAppSelector } from "@/redux store/hooks.js";
import { multipleNonContinousDatesEventsMeetingSelectionErrorConstants } from "@/constant string files/eventsMeetingSelectionErrorConstants.js";
import { wantFoodServiceConstants, eventMeetingTimingConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";


function EachDateBookingComponent(props){

    const eachDayFoodPrice = useAppSelector((reduxStore) => reduxStore.eventMeetingEachDayFoodPriceSliceName.eachDayFoodPrice);

    const meetingEventsInfoTitle = props.meetingEventsInfoTitle;
    const meetingEventsSeatingInfo = props.meetingEventsSeatingInfo;
    const dateNumber = props.dateNumber;

    const todayDate = new Date().toISOString().split("T")[0];
    const today = new Date(todayDate);

    const [meetingEventBookingDate, setMeetingEventBookingDate] = useState(today);
    const [meetingEventBookingTime, setMeetingEventBookingTime] = useState([]);
    const [meetingEventSeatingArrangement, setMeetingEventSeatingArrangement] = useState('');
    const [maximumGuestAttending, setMaximumGuestAttending] = useState(1);
    const [wantFoodServices, setWantFoodServices] = useState(wantFoodServiceConstants.WANT_FOOD_SERVICE_NO);

    const [selectedMeals, setSelectedMeals] = useState({
        midNight: [],
        morning: [],
        afternoon: [],
        evening: [],
        night: []
    });
    const [totalPriceEventMeetingRoom, setTotalPriceEventMeetingRoom] = useState(0);

    const [checkAvailabiltyBlockDisplay, setCheckAvailabiltyBlockDisplay] = useState(true);
    const [incorrectInput, setIncorrectInput] = useState(false);
    const [incorrectInputMessage, setIncorrectInputMessage] = useState('');
    const [isRoomDetailsEditable, setRoomDetailsEditable] = useState(true);
    const [showWantEditButton, setShowWantEditButton] = useState(true);
    const [showContinueButton, setShowContinueButton] = useState(true);
    const [bookingDetailsForCart, setBookingDetailsForCart] = useState(null);

    const meetingEventDateFoodDetails = fetchDateFoodDetails(eachDayFoodPrice);

    const isRoomAvailable = true;

    const isMidNightChecked = meetingEventBookingTime.some(function (eachTime){
        return (eachTime === eventMeetingTimingConstants.MID_NIGHT_TIME)
    });

    const isMorningChecked = meetingEventBookingTime.some(function (eachTime){
        return (eachTime === eventMeetingTimingConstants.MORNING_TIME)
    });

    const isAfternoonChecked = meetingEventBookingTime.some(function (eachTime){
        return (eachTime === eventMeetingTimingConstants.AFTERNOON_TIME)
    });

    const isEveningChecked = meetingEventBookingTime.some(function (eachTime){
        return (eachTime === eventMeetingTimingConstants.EVENING_TIME)
    });

    const isNightChecked = meetingEventBookingTime.some(function (eachTime){
        return (eachTime === eventMeetingTimingConstants.NIGHT_TIME)
    });

    const onlyMeetingEventsSeatingInfoWhereSeatingPresent = meetingEventsSeatingInfo.filter(function(eachSeatingArrangement){
        return (eachSeatingArrangement.meetingEventAreaSeatingCapacity != 'N/A');
    });

    let showFoodOptions = false;
    if(wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && meetingEventBookingDate != null && meetingEventBookingTime.length > 0){
        showFoodOptions = true;
    }

    const midNightFoodArray = getFoodListOfCurrentMeal(meetingEventDateFoodDetails, eventMeetingTimingConstants.MID_NIGHT_TIME);
    const morningFoodArray = getFoodListOfCurrentMeal(meetingEventDateFoodDetails, eventMeetingTimingConstants.MORNING_TIME);
    const afternoonFoodArray = getFoodListOfCurrentMeal(meetingEventDateFoodDetails, eventMeetingTimingConstants.AFTERNOON_TIME);
    const eveningFoodArray = getFoodListOfCurrentMeal(meetingEventDateFoodDetails, eventMeetingTimingConstants.EVENING_TIME);
    const nightFoodArray = getFoodListOfCurrentMeal(meetingEventDateFoodDetails, eventMeetingTimingConstants.NIGHT_TIME);

    let maximumGuestAllowedForSeatingArrangement = 0;
    if(meetingEventSeatingArrangement != ''){
        const selectedMeetingAreaInfo = meetingEventsSeatingInfo.find(function(eachSeatingArrangement){
            return meetingEventSeatingArrangement == eachSeatingArrangement.meetingEventAreaSeatingTitle;
        });
        maximumGuestAllowedForSeatingArrangement = selectedMeetingAreaInfo.meetingEventAreaSeatingCapacity;
    }


    function fetchDateFoodDetails(eachDayFoodPrice){
        const allDayFoodDetails = eachDayFoodPrice.meetingEventFoodPriceWithDate;
        const bookingDate = convertDateTextToDate(meetingEventBookingDate).toString();
        const bookingDateFoodDetails = allDayFoodDetails.find(function(eachDate){
            const eachDateString = eachDate.date.split("T")[0];
            return bookingDate == eachDateString;
        });
        return (bookingDateFoodDetails.eventTimingDetails);
    }
    
    function getFoodListOfCurrentMeal(foodDetailsOfDate, foodCategory){
        const currentMealFoodDetail = foodDetailsOfDate.find(function(eachFoodCategory){
            return eachFoodCategory.meetingEventCurrentTiming == foodCategory;
        });
        const currentMealFoodList = currentMealFoodDetail.meetingEventCurrentTimingFoodPrice;
        const currentMealFoodArray = currentMealFoodList.map(function(eachFoodList){
            return eachFoodList.foodTitle
        })
        return currentMealFoodArray;
    }

    function meetingEventTimeChangeHandler(event) {
        const checked = event.target.checked;
        const newClickedValue = event.target.value;
        if(checked){
            const updatedMeetingEventBookingTime = [...meetingEventBookingTime, newClickedValue]
            setMeetingEventBookingTime(updatedMeetingEventBookingTime);
        }
        else{
            const updatedMeetingEventBookingTime = meetingEventBookingTime.filter(function(eachTime){
                return (newClickedValue !== eachTime);
            });
            setMeetingEventBookingTime(updatedMeetingEventBookingTime);
        }
    }

    function meetingEventSeatingArrangementChangeHandler(event) {
        setMeetingEventSeatingArrangement(event.target.value);
    }

    function mealSelectionChangeHandler(event, foodCategory) {
        const value = event.target.value;
        const checked = event.target.checked;
        if(checked){
            setSelectedMeals(function(previousState){
                return {
                    ...previousState,
                    [foodCategory]: [...previousState[foodCategory], value]
                }
            });
        }
        else{
            setSelectedMeals(function(previousState){
                return {
                    ...previousState,
                    [foodCategory]: (previousState[foodCategory]).filter(function(item){
                        return item !== value;
                    })
                }
            });
        }
    }

    function getTotalPriceOfRoom(totalPriceOfAllRooms){
        setTotalPriceEventMeetingRoom(totalPriceOfAllRooms);
    }

    function editDetailsClickHandler(){
        setRoomDetailsEditable(true);
        setCheckAvailabiltyBlockDisplay(true);
    }

    function checkAvailabilityClickHandler(event){
        event.preventDefault();
        setCheckAvailabiltyBlockDisplay(false);
        if(meetingEventBookingTime.length > 0 && meetingEventSeatingArrangement !== '' && meetingEventBookingDate != null){
            if(maximumGuestAttending >= 1){
                if(maximumGuestAttending > maximumGuestAllowedForSeatingArrangement){
                    setIncorrectInput(true);
                    setIncorrectInputMessage(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.GUEST_COUNT_GREATER_THAN_CAPACITY);
                }
                else if(maximumGuestAttending <= maximumGuestAllowedForSeatingArrangement){
                    if(wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_NO){
                        setIncorrectInput(false);
                        setIncorrectInputMessage('');
                        const bookingDetails = {
                            dateNumber,
                            meetingEventsInfoTitle,
                            meetingEventBookingDate,
                            meetingEventBookingTime,
                            meetingEventSeatingArrangement,
                            maximumGuestAttending,
                            wantFoodServices
                        }
                        setBookingDetailsForCart(bookingDetails);
                    }
                    else if(wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES){
                        const midNightSelectedMeals = selectedMeals.midNight;
                        const morningSelectedMeals = selectedMeals.morning;
                        const afternoonSelectedMeals = selectedMeals.afternoon;
                        const eveningSelectedMeals = selectedMeals.evening;
                        const nightSelectedMeals = selectedMeals.night;
                        if(midNightSelectedMeals.length == 0 && morningSelectedMeals.length == 0 && afternoonSelectedMeals.length == 0 && eveningSelectedMeals.length == 0 && nightSelectedMeals.length == 0){
                            setIncorrectInput(true);
                            setIncorrectInputMessage(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.SELECT_FOOD_ITEM);
                        }
                        else if(midNightSelectedMeals.length > 0 || morningSelectedMeals.length > 0 || afternoonSelectedMeals.length > 0 || eveningSelectedMeals.length > 0 || nightSelectedMeals.length > 0){
                            setIncorrectInput(false);
                            setIncorrectInputMessage('');
                            const bookingDetails = {
                                dateNumber,
                                meetingEventsInfoTitle,
                                meetingEventBookingDate,
                                meetingEventBookingTime,
                                meetingEventSeatingArrangement,
                                maximumGuestAttending,
                                wantFoodServices,
                                selectedMealsOnBookingDate: selectedMeals
                            }
                            setBookingDetailsForCart(bookingDetails);
                        }
                    }
                }
            }
            else if(maximumGuestAttending < 1){
                setIncorrectInput(true);
                setIncorrectInputMessage(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.GUEST_NOT_LESS_THAN_ONE);
            }
        }
        else if(meetingEventBookingTime.length == 0 && meetingEventSeatingArrangement === '' && meetingEventBookingDate == null){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_DATE_BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED);
        }
        else if(meetingEventBookingTime.length == 0 && meetingEventSeatingArrangement === ''){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED);
        }
        else if(meetingEventBookingTime.length == 0 && meetingEventBookingDate == null){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_DATE_BOOKING_TIME_REQUIRED);
        }
        else if(meetingEventSeatingArrangement === '' && meetingEventBookingDate == null){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_DATE_SEATING_ARRANGEMENT_REQUIRED);
        }
        else if(meetingEventBookingDate == null){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_DATE_REQUIRED);
        }
        else if(meetingEventBookingTime.length == 0){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_TIME_REQUIRED);
        }
        else if(meetingEventSeatingArrangement === ''){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.SEATING_ARRANGEMENT_REQUIRED);
        }
    }

    function addToRoomListClickHandler() {   
        console.log(bookingDetailsForCart);
        setRoomDetailsEditable(false);
    }

    function continueClickHandler(){
        const currentDateBookingDetailsWithPrice = {
            ...bookingDetailsForCart,
            totalPriceEventMeetingRoom
        }
        setShowWantEditButton(false);
        setShowContinueButton(false);
        console.log(currentDateBookingDetailsWithPrice);
        props.onGetRoomBookingInfo(currentDateBookingDetailsWithPrice);;
    }


    return(
        <div className={styles.eachDateContainer}>
            <h4>Please enter details for Date-{dateNumber}</h4>

            {isRoomDetailsEditable &&
            <label htmlFor="meeting-event-date">
                <div className={styles.eachLabelHeading}>Please Select Date of Meeting/Event: </div>
                <DatePicker 
                    value={meetingEventBookingDate} 
                    minDate={today}
                    format="dd/MM/y"
                    onChange={setMeetingEventBookingDate} 
                />
            </label> 
            }

            {isRoomDetailsEditable &&
            <label htmlFor="meeting-event-time">
                <div className={styles.eachLabelHeading}>Please Select Time of Meeting/Event: </div>
                <input 
                    type="checkbox" 
                    id="mid-night" 
                    className={styles.eachLabelForTime}
                    name="meeting-event-time-check"
                    value={eventMeetingTimingConstants.MID_NIGHT_TIME}
                    checked={isMidNightChecked}
                    onChange={meetingEventTimeChangeHandler}
                />
                <label className={styles.eachLabelNaming} htmlFor="mid-night"> Mid Night (12AM - 4AM) </label>
                <input 
                    type="checkbox" 
                    id="morning" 
                    className={styles.eachLabelForTime}
                    name="meeting-event-time-check"
                    value={eventMeetingTimingConstants.MORNING_TIME}
                    checked={isMorningChecked}
                    onChange={meetingEventTimeChangeHandler}
                />
                <label className={styles.eachLabelNaming} htmlFor="morning"> Morning (8AM - 12PM) </label>
                <input 
                    type="checkbox" 
                    id="afternoon" 
                    className={styles.eachLabelForTime}
                    name="meeting-event-time-check"
                    value={eventMeetingTimingConstants.AFTERNOON_TIME}
                    checked={isAfternoonChecked}
                    onChange={meetingEventTimeChangeHandler}
                />
                <label className={styles.eachLabelNaming} htmlFor="afternoon"> Afternoon (12PM-4PM) </label>
                <input 
                    type="checkbox" 
                    id="evening" 
                    className={styles.eachLabelForTime}
                    name="meeting-event-time-check"
                    value={eventMeetingTimingConstants.EVENING_TIME}
                    checked={isEveningChecked}
                    onChange={meetingEventTimeChangeHandler}
                />
                <label className={styles.eachLabelNaming} htmlFor="evening"> Evening (4PM-8PM) </label>
                <input
                    type="checkbox" 
                    id="night"
                    className={styles.eachLabelForTime} 
                    name="meeting-event-time-check"
                    value={eventMeetingTimingConstants.NIGHT_TIME}
                    checked={isNightChecked}
                    onChange={meetingEventTimeChangeHandler}
                />
                <label className={styles.eachLabelNaming} htmlFor="night"> Night (8PM-12AM) </label>
            </label> 
            }

            {isRoomDetailsEditable &&
            <label>
                <div className={styles.eachLabelHeading}>Please Select Seating Arrangement of Meeting/Event: </div>
                <div className={styles.allSeatingArrangement}>
                    {onlyMeetingEventsSeatingInfoWhereSeatingPresent.map(function(eachSeatingArrangement){
                        return (
                            <div className={styles.eachSeatingArrangement} key={eachSeatingArrangement.meetingEventAreaSeatingTitle}>
                                <input 
                                    type="radio"
                                    id={eachSeatingArrangement.meetingEventAreaSeatingTitle}
                                    className={styles.eachLabelForSeating}
                                    name="seating-arrangement-type"
                                    value={eachSeatingArrangement.meetingEventAreaSeatingTitle}
                                    checked={meetingEventSeatingArrangement === eachSeatingArrangement.meetingEventAreaSeatingTitle}
                                    onChange={meetingEventSeatingArrangementChangeHandler}
                                />
                                <label className={styles.eachLabelSeatName} htmlFor={eachSeatingArrangement.meetingEventAreaSeatingTitle}>{eachSeatingArrangement.meetingEventAreaSeatingTitle}</label>
                            </div>
                        )
                    })}
                </div>
            </label>
            }

            {isRoomDetailsEditable &&
            <label>
                <div className={styles.eachLabelHeading}>Enter Maximum Number of Guest Attending the Function: </div>
                <input 
                    type="number"
                    value={maximumGuestAttending}
                    min="1"
                    onChange={(event)=> setMaximumGuestAttending(event.target.value)}
                />
            </label>
            }

            {isRoomDetailsEditable &&
            <label>
                <div className={styles.eachLabelHeading}>Do you want to include the Food Services? </div>
                <input 
                    type="radio" 
                    name="food-service-selector" 
                    id="yes-food" 
                    className={styles.eachLabelYesNoFood}
                    value={wantFoodServiceConstants.WANT_FOOD_SERVICE_YES}
                    checked={wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES}
                    onChange={(event)=>setWantFoodServices(event.target.value)}
                />
                <label className={styles.foodYesNo} htmlFor="yes-food">Yes</label>
                <input 
                    type="radio"
                    name="food-service-selector" 
                    id="no-food" 
                    className={styles.eachLabelYesNoFood}
                    value={wantFoodServiceConstants.WANT_FOOD_SERVICE_NO}
                    checked={wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_NO}
                    onChange={(event)=>setWantFoodServices(event.target.value)}
                />
                <label className={styles.foodYesNo} htmlFor="no-food">No</label>
            </label>
            }

            {(showFoodOptions && isRoomDetailsEditable) &&
                <label>
                    <div className={styles.eachLabelHeading}>Please Select Food Options</div>
                    {isMidNightChecked &&
                    <div className={styles.foodSelectorCategory}>
                        <div className={styles.foodSelectorCategoryHeader}>Select Mid Night Meals: </div>
                        <div className={styles.eachFoodContainer}>
                            {midNightFoodArray.map(function(eachFoodItem) {
                                return (
                                    <div className={styles.eachFoodLabeling}>
                                        <input 
                                            type='checkbox' 
                                            id={eachFoodItem.replace(/ /g, '-')}
                                            value={eachFoodItem}
                                            className={styles.eachLabelForFoodItem}
                                            name="mid-night-food-selection"
                                            checked={selectedMeals.midNight.includes(eachFoodItem)}
                                            onChange={(event) => mealSelectionChangeHandler(event, 'midNight')}
                                        />
                                        <label classNmae={styles.eachFoodLabelContent} htmlFor={eachFoodItem.replace(/ /g, '-')}>
                                            {eachFoodItem.split("(")[0]}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    }
                    {isMorningChecked &&
                    <div className={styles.foodSelectorCategory}>
                        <div className={styles.foodSelectorCategoryHeader}>Select Morning Meals: </div>
                        <div className={styles.eachFoodContainer}>
                            {morningFoodArray.map(function(eachFoodItem){
                                return (
                                    <div className={styles.eachFoodContainer}>
                                        <input 
                                            type='checkbox' 
                                            id={eachFoodItem.replace(/ /g, '-')}
                                            value={eachFoodItem}
                                            className={styles.eachLabelForFoodItem}
                                            name="morning-food-selection"
                                            checked={selectedMeals.morning.includes(eachFoodItem)}
                                            onChange={(event) => mealSelectionChangeHandler(event, 'morning')}
                                        />
                                        <label classNmae={styles.eachFoodLabelContent} htmlFor={eachFoodItem.replace(/ /g, '-')}>
                                            {eachFoodItem.split("(")[0]}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    }
                    {isAfternoonChecked &&
                    <div className={styles.foodSelectorCategory}>
                        <div className={styles.foodSelectorCategoryHeader}>Select Afternoon Meals: </div>
                        <div className={styles.eachFoodContainer}>
                            {afternoonFoodArray.map(function(eachFoodItem){
                                return (
                                    <div className={styles.eachFoodContainer}>
                                        <input 
                                            type='checkbox' 
                                            id={eachFoodItem.replace(/ /g, '-')}
                                            value={eachFoodItem}
                                            className={styles.eachLabelForFoodItem}
                                            name="afternoon-food-selection"
                                            checked={selectedMeals.afternoon.includes(eachFoodItem)}
                                            onChange={(event) => mealSelectionChangeHandler(event, 'afternoon')}
                                        />
                                        <label classNmae={styles.eachFoodLabelContent} htmlFor={eachFoodItem.replace(/ /g, '-')}>
                                            {eachFoodItem.split("(")[0]}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    }
                    {isEveningChecked &&
                    <div className={styles.foodSelectorCategory}>
                        <div className={styles.foodSelectorCategoryHeader}>Select Evening Meals: </div>
                        <div className={styles.eachFoodContainer}>
                            {eveningFoodArray.map(function(eachFoodItem){
                                return (
                                    <div className={styles.eachFoodContainer}>
                                        <input 
                                            type='checkbox' 
                                            id={eachFoodItem.replace(/ /g, '-')}
                                            value={eachFoodItem}
                                            className={styles.eachLabelForFoodItem}
                                            name="evening-food-selection"
                                            checked={selectedMeals.evening.includes(eachFoodItem)}
                                            onChange={(event) => mealSelectionChangeHandler(event, 'evening')}
                                        />
                                        <label classNmae={styles.eachFoodLabelContent} htmlFor={eachFoodItem.replace(/ /g, '-')}>
                                            {eachFoodItem.split("(")[0]}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    }
                    {isNightChecked &&
                    <div className={styles.foodSelectorCategory}>
                        <div className={styles.foodSelectorCategoryHeader}>Select Night Meals: </div>
                        <div className={styles.eachFoodContainer}>
                            {nightFoodArray.map(function(eachFoodItem){
                                return (
                                    <div className={styles.eachFoodContainer}>
                                        <input 
                                            type='checkbox' 
                                            id={eachFoodItem.replace(/ /g, '-')}
                                            value={eachFoodItem}
                                            className={styles.eachLabelForFoodItem}
                                            name="night-food-selection"
                                            checked={selectedMeals.night.includes(eachFoodItem)}
                                            onChange={(event) => mealSelectionChangeHandler(event, 'night')}
                                        />
                                        <label classNmae={styles.eachFoodLabelContent} htmlFor={eachFoodItem.replace(/ /g, '-')}>
                                            {eachFoodItem.split("(")[0]}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    }
                </label>
            }


            {(checkAvailabiltyBlockDisplay && isRoomDetailsEditable) &&
                <div className={styles.buttonContainer}>
                    <Button variant="contained" onClick={checkAvailabilityClickHandler}>Check Availability</Button>
                </div>
            }
            
            {(!checkAvailabiltyBlockDisplay && incorrectInput && isRoomDetailsEditable) &&
                <div className={styles.buttonContainer}>
                    <p className={styles.inputError}>{incorrectInputMessage}</p>
                    <br />
                    <Button onClick={()=> setCheckAvailabiltyBlockDisplay(true)} variant="contained">Select Again</Button>
                </div>
            }
            
            {(!checkAvailabiltyBlockDisplay && isRoomAvailable && !incorrectInput && isRoomDetailsEditable) &&
                <div className={styles.buttonContainer}>
                    <p className={styles.roomAvailable}>The Meeting and Event Room is available in choosen Date and Time Slot.</p>
                    <br />
                    <Button variant="contained" onClick={addToRoomListClickHandler}>Add this Event Room for Booking</Button>
                </div>
            }
            
            {(!checkAvailabiltyBlockDisplay && !isRoomAvailable && !incorrectInput && isRoomDetailsEditable) &&
                <div className={styles.buttonContainer}>
                    <p className={styles.roomNotAvailable}>Sorry for your Inconvenience</p>
                    <p className={styles.roomNotAvailable}>The Meeting and Event Room is not available in choosen Date and Time Slot.</p>
                    <p className={styles.roomNotAvailable}>It has been booked by Another Customer.</p>
                    <p className={styles.roomNotAvailable}>Please Select other Meeting and Event Room or Select other Time Slot or Date.</p>
                    <br />
                    <Button variant="contained" onClick={()=> setCheckAvailabiltyBlockDisplay(true)}>Close</Button>
                </div>
            }
            
            {!isRoomDetailsEditable &&
            <div className={styles.buttonContainer}>
                <p className={styles.roomSuccessfullyAdded}>Room Details added Successfully</p>
                <div className={styles.roomDetailsContainer}>
                    <EventMeetingBookingsDetailsConfirmation 
                        bookingDetailsForCart={bookingDetailsForCart} 
                        totalPriceEventMeetingRoom = {totalPriceEventMeetingRoom}
                    />
                    <br />
                    <PriceDetailsEachDate 
                        bookingDetailsForCart={bookingDetailsForCart}
                        setTotalPriceOfRoom={getTotalPriceOfRoom} 
                    />
                </div>
                <br />
                {showWantEditButton &&
                <Button variant="contained" onClick={editDetailsClickHandler}>Want to Edit details</Button>
                }
                <br />
                {showContinueButton &&
                <Button variant="contained" onClick={continueClickHandler}>Continue</Button>
                }
            </div>
            }

        </div>
    );

}

export default EachDateBookingComponent;