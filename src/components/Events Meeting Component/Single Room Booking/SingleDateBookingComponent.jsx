'use client'
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import styles from "./SingleDateBookingComponent.module.css";

import { convertDateTextToDate } from "@/functions/date.js";
import { useAppDispatch } from "@/redux store/hooks.js";
import { addNewBookingToEventMeetingCart } from "@/redux store/features/Booking Features/eventMeetingRoomBookingCartSlice.js";
import PriceDetailsSingleDate from './PriceDetailsSingleDate.jsx';
import EventMeetingBookingsDetailsConfirmation from '@/components/Events Meeting Component/Common Components/EventMeetingBookingsDetailsConfirmation.jsx';


function SingleDateBookingComponent(props) {

    const meetingEventsInfoTitle = props.meetingEventsInfoTitle;
    const meetingEventsSeatingInfo = props.meetingEventsSeatingInfo;
    const roomBookingDateType = props.roomBookingDateType;
    const dispatch = useAppDispatch();

    const todayDate = new Date().toISOString().split("T")[0];
    const today = new Date(todayDate);

    const [meetingEventBookingDate, setMeetingEventBookingDate] = useState(today);
    const [meetingEventBookingTime, setMeetingEventBookingTime] = useState([]);
    const [meetingEventSeatingArrangement, setMeetingEventSeatingArrangement] = useState('');
    const [maximumGuestAttending, setMaximumGuestAttending] = useState(1);
    const [wantFoodServices, setWantFoodServices] = useState('No');

    const [meetingEventDateFoodDetails, setMeetingEventDateFoodDetails] = useState(null);
    const [selectedMeals, setSelectedMeals] = useState({
        midNight: [],
        morning: [],
        afternoon: [],
        evening: [],
        night: []
    });
    const [totalPriceEventMeetingRoom, setTotalPriceEventMeetingRoom] = useState(0);


    useEffect(()=>{
        fetchDateFoodDetails();
    },[meetingEventBookingDate]);

    const [checkAvailabiltyBlockDisplay, setCheckAvailabiltyBlockDisplay] = useState(true);
    const [incorrectInput, setIncorrectInput] = useState(false);
    const [incorrectInputMessage, setIncorrectInputMessage] = useState('');
    const [isRoomDetailsEditable, setRoomDetailsEditable] = useState(true);
    const [showSuccessfullyCartAddedBlock, setShowSuccessfullyCartAddedBlock] = useState(false);
    const [bookingDetailsForCart, setBookingDetailsForCart] = useState(null);


    const isRoomAvailable = true;

    const isMidNightChecked = meetingEventBookingTime.some(function (eachTime){
        return (eachTime === "Mid Night")
    });

    const isMorningChecked = meetingEventBookingTime.some(function (eachTime){
        return (eachTime === "Morning")
    });

    const isAfternoonChecked = meetingEventBookingTime.some(function (eachTime){
        return (eachTime === "Afternoon")
    });

    const isEveningChecked = meetingEventBookingTime.some(function (eachTime){
        return (eachTime === "Evening")
    });

    const isNightChecked = meetingEventBookingTime.some(function (eachTime){
        return (eachTime === "Night")
    });

    const onlyMeetingEventsSeatingInfoWhereSeatingPresent = meetingEventsSeatingInfo.filter(function(eachSeatingArrangement){
        return (eachSeatingArrangement.meetingEventAreaSeatingCapacity != 'N/A');
    });

    let showFoodOptions = false;
    if(wantFoodServices == 'Yes' && meetingEventBookingDate != null && meetingEventBookingTime.length > 0){
        showFoodOptions = true;
    }

    let midNightFoodArray = [];
    let morningFoodArray = [];
    let afternoonFoodArray = [];
    let eveningFoodArray = [];
    let nightFoodArray = [];

    if(meetingEventDateFoodDetails != null){
        midNightFoodArray = getFoodListOfCurrentMeal(meetingEventDateFoodDetails, 'Mid Night');
        morningFoodArray = getFoodListOfCurrentMeal(meetingEventDateFoodDetails, 'Morning');
        afternoonFoodArray = getFoodListOfCurrentMeal(meetingEventDateFoodDetails, 'Afternoon');
        eveningFoodArray = getFoodListOfCurrentMeal(meetingEventDateFoodDetails, 'Evening');
        nightFoodArray = getFoodListOfCurrentMeal(meetingEventDateFoodDetails, 'Night');
    }

    let maximumGuestAllowedForSeatingArrangement = 0;
    if(meetingEventSeatingArrangement != ''){
        const selectedMeetingAreaInfo = meetingEventsSeatingInfo.find(function(eachSeatingArrangement){
            return meetingEventSeatingArrangement == eachSeatingArrangement.meetingEventAreaSeatingTitle;
        });
        maximumGuestAllowedForSeatingArrangement = selectedMeetingAreaInfo.meetingEventAreaSeatingCapacity;
    }


    async function fetchDateFoodDetails(){
        try {
            const response = await fetch('/api/hotel-booking-information/events-meeting-room-information/each-day-food-price/');
            const data = await response.json();
            const allDayFoodDetails = data.meetingEventFoodPriceWithDate;
            const bookingDate = convertDateTextToDate(meetingEventBookingDate).toString();
            const bookingDateFoodDetails = allDayFoodDetails.find(function(eachDate){
                const eachDateString = eachDate.date.split("T")[0];
                return bookingDate == eachDateString;
            });
            setMeetingEventDateFoodDetails(bookingDateFoodDetails.eventTimingDetails);
        } catch (error) {
            console.log(error);
        }
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
                    setIncorrectInputMessage('You have entered Number of Guests greater than Seating Arrangement Capacity');
                }
                else if(maximumGuestAttending <= maximumGuestAllowedForSeatingArrangement){
                    if(wantFoodServices == 'No'){
                        setIncorrectInput(false);
                        setIncorrectInputMessage('');
                        const bookingDetails = {
                            roomBookingDateType,
                            meetingEventsInfoTitle,
                            meetingEventBookingDate,
                            meetingEventBookingTime,
                            meetingEventSeatingArrangement,
                            maximumGuestAttending,
                            wantFoodServices,
                        }
                        setBookingDetailsForCart(bookingDetails);
                    }
                    else if(wantFoodServices == 'Yes'){
                        const midNightSelectedMeals = selectedMeals.midNight;
                        const morningSelectedMeals = selectedMeals.morning;
                        const afternoonSelectedMeals = selectedMeals.afternoon;
                        const eveningSelectedMeals = selectedMeals.evening;
                        const nightSelectedMeals = selectedMeals.night;
                        if(midNightSelectedMeals.length == 0 && morningSelectedMeals.length == 0 && afternoonSelectedMeals.length == 0 && eveningSelectedMeals.length == 0 && nightSelectedMeals.length == 0){
                            setIncorrectInput(true);
                            setIncorrectInputMessage('Please Select atleast one Food Item if you want Food Services!');
                        }
                        else if(midNightSelectedMeals.length > 0 || morningSelectedMeals.length > 0 || afternoonSelectedMeals.length > 0 || eveningSelectedMeals.length > 0 || nightSelectedMeals.length > 0){
                            setIncorrectInput(false);
                            setIncorrectInputMessage('');
                            const bookingDetails = {
                                roomBookingDateType,
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
                setIncorrectInputMessage('Number of guest cannot be less than 1');
            }
        }

        else if(meetingEventBookingTime.length == 0 && meetingEventSeatingArrangement === '' && meetingEventBookingDate == null){
            setIncorrectInput(true);
            setIncorrectInputMessage('Incorrect Input !!!  Please Choose Event Booking Date, Event Booking Time and Event Seating Arrangement.');
        }
        else if(meetingEventBookingTime.length == 0 && meetingEventSeatingArrangement === ''){
            setIncorrectInput(true);
            setIncorrectInputMessage('Incorrect Input !!!  Please Choose Event Booking Time and Event Seating Arrangement');
        }
        else if(meetingEventBookingTime.length == 0 && meetingEventBookingDate == null){
            setIncorrectInput(true);
            setIncorrectInputMessage('Incorrect Input !!!  Please Choose Event Booking Date and Event Booking Time');
        }
        else if(meetingEventSeatingArrangement === '' && meetingEventBookingDate == null){
            setIncorrectInput(true);
            setIncorrectInputMessage('Incorrect Input !!!  Please Choose Event Booking Date and Event Seating Arrangement');
        }
        else if(meetingEventBookingDate == null){
            setIncorrectInput(true);
            setIncorrectInputMessage('Incorrect Input !!!  Please Choose Event Booking Date');
        }
        else if(meetingEventBookingTime.length == 0){
            setIncorrectInput(true);
            setIncorrectInputMessage('Incorrect Input !!!  Please Choose Event Booking Time');
        }
        else if(meetingEventSeatingArrangement === ''){
            setIncorrectInput(true);
            setIncorrectInputMessage('Incorrect Input !!!  Please Choose Event Seating Arrangement');
        }
    }

    function getTotalPriceOfRoom(totalPriceOfAllRooms){
        setTotalPriceEventMeetingRoom(totalPriceOfAllRooms);
    }

    function addCartClickHandler() {
        const eventBookingDetails = JSON.parse(JSON.stringify(bookingDetailsForCart));
        eventBookingDetails.meetingEventBookingDate = convertDateTextToDate(bookingDetailsForCart.meetingEventBookingDate).toString();

        const bookingDetailsWithPrice = {
            eventCartId: Date.now(),
            ...eventBookingDetails,
            totalPriceEventMeetingRoom
        }
        console.log(bookingDetailsWithPrice);
        dispatch(addNewBookingToEventMeetingCart(bookingDetailsWithPrice));
        setShowSuccessfullyCartAddedBlock(true);
    }

    return (
        <div className={styles.singleDateBookContainer}>
            <form>

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
                        id="morning" 
                        className={styles.eachLabelForTime}
                        name="meeting-event-time-check"
                        value="Morning"
                        checked={isMorningChecked}
                        onChange={meetingEventTimeChangeHandler}
                    />
                    <label className={styles.eachLabelNaming} htmlFor="morning"> Morning (8AM - 12PM) </label>
                    <input 
                        type="checkbox" 
                        id="afternoon" 
                        className={styles.eachLabelForTime}
                        name="meeting-event-time-check"
                        value="Afternoon"
                        checked={isAfternoonChecked}
                        onChange={meetingEventTimeChangeHandler}
                    />
                    <label className={styles.eachLabelNaming} htmlFor="afternoon"> Afternoon (12PM-4PM) </label>
                    <input 
                        type="checkbox" 
                        id="evening" 
                        className={styles.eachLabelForTime}
                        name="meeting-event-time-check"
                        value="Evening"
                        checked={isEveningChecked}
                        onChange={meetingEventTimeChangeHandler}
                    />
                    <label className={styles.eachLabelNaming} htmlFor="evening"> Evening (4PM-8PM) </label>
                    <input
                        type="checkbox" 
                        id="night"
                        className={styles.eachLabelForTime} 
                        name="meeting-event-time-check"
                        value="Night"
                        checked={isNightChecked}
                        onChange={meetingEventTimeChangeHandler}
                    />
                    <label className={styles.eachLabelNaming} htmlFor="night"> Night (8PM-12AM) </label>
                    <input 
                        type="checkbox" 
                        id="mid-night" 
                        className={styles.eachLabelForTime}
                        name="meeting-event-time-check"
                        value="Mid Night"
                        checked={isMidNightChecked}
                        onChange={meetingEventTimeChangeHandler}
                    />
                    <label className={styles.eachLabelNaming} htmlFor="mid-night"> Mid Night (12AM-4AM) </label>
                </label>
                }

                {isRoomDetailsEditable && 
                <p className={styles.noteLine1}>Note: Date for "Mid Night (12AM-4AM)" will be on next day of Date you select while Booking.</p>
                }
                {isRoomDetailsEditable && 
                <p className={styles.noteLine2}>For eg. you select 20th April 2024 and time is 12AM to 4AM. Then booking is for 21st April 2024 for time 12AM to 4AM.</p>
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
                        value="Yes"
                        checked={wantFoodServices == "Yes"}
                        onChange={(event)=>setWantFoodServices(event.target.value)}
                    />
                    <label className={styles.foodYesNo} htmlFor="yes-food">Yes</label>
                    <input 
                        type="radio"
                        name="food-service-selector" 
                        id="no-food" 
                        className={styles.eachLabelYesNoFood}
                        value="No"
                        checked={wantFoodServices == "No"}
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
                        <Button variant="contained" onClick={checkAvailabilityClickHandler}>
                            Check Availability
                        </Button>
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
                        <Button onClick={()=> setRoomDetailsEditable(false)} variant="contained">Procced</Button>
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
                
                {(!isRoomDetailsEditable && !showSuccessfullyCartAddedBlock) &&
                <div className={styles.buttonContainer}>
                    <p className={styles.roomSuccessfullyAdded}>Room Details added Successfully</p>
                    <div className={styles.roomDetailsContainer}>
                        <EventMeetingBookingsDetailsConfirmation 
                            bookingDetailsForCart={bookingDetailsForCart} 
                            totalPriceEventMeetingRoom = {totalPriceEventMeetingRoom}
                        />
                        <br/ >
                        <PriceDetailsSingleDate 
                            bookingDetailsForCart={bookingDetailsForCart}
                            setTotalPriceOfRoom={getTotalPriceOfRoom} 
                        />
                    </div>
                    <br />
                    <Button variant="contained" onClick={editDetailsClickHandler}>Want to Edit details</Button>
                    <br />
                    
                    <Button variant="contained" onClick={addCartClickHandler}>Add to Cart</Button>
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

export default SingleDateBookingComponent;