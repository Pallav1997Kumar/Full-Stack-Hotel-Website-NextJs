'use client'
import React, { useState, useEffect, useReducer, useCallback, useMemo } from 'react';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker'
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

import styles from "./DiningBookingComponent.module.css";

import { useAppDispatch, useAppSelector } from "@/redux store/hooks.js";
import { addNewBookingToDiningCart } from "@/redux store/features/Booking Features/diningBookingCartSlice.js";
import { convertDateTextToDate } from "@/functions/date.js";
import { getDiningEachDayPrice } from "@/redux store/features/Price Features/diningEachDayPriceSlice";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from '@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice';
import { diningSelectionErrorConstants } from "@/constant string files/diningSelectionErrorConstants.js";
import { INFORMATION_ADD_TO_CART_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


const initialDiningTableCount = {
    twoPersonTableCount: 0,
    fourPersonTableCount: 0,
    sixPersonTableCount: 0
}

function diningTableCounterReducer(state, action){
    
    switch (action.type) {
        case 'Increment':
            return {
                ...state,
                [action.payload.tableType]: state[action.payload.tableType] + 1
            }
            break;
        case 'Decrement':
            return {
                ...state,
                [action.payload.tableType]: state[action.payload.tableType] - 1
            }
            break;
        default:
            return {
                state
            }
            break;
    }
}


function DiningBookingComponent(props){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserIdDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    const [diningTableCountState, diningTableCountDispatch] = useReducer(diningTableCounterReducer, initialDiningTableCount);
    const tableCountTwoPerson = diningTableCountState.twoPersonTableCount;
    const tableCountFourPerson = diningTableCountState.fourPersonTableCount;
    const tableCountSixPerson = diningTableCountState.sixPersonTableCount;

    useEffect(()=>{
        dispatch(getDiningEachDayPrice());
        fetchDiningEachDayData();
    },[]);

    const diningRestaurantInfo = props.diningRestaurantInfo;
    const diningRestaurantTitle = diningRestaurantInfo.diningAreaTitle;
    const diningPath = diningRestaurantInfo.diningPath;

    const [diningEachDayInfo, setDiningEachDayInfo] = useState(null);
    // console.log(diningEachDayInfo)

    const todayDate = new Date().toISOString().split("T")[0];
    const today = new Date(todayDate);

    // let diningBookingLastDateString = '9999-12-31';
    // if(diningEachDayInfo != null){
    //     diningBookingLastDateString = getDiningBookingLastDate(diningEachDayInfo);
    // }
    const diningBookingLastDateString = useMemo(function(){
        if (diningEachDayInfo != null) {
            return getDiningBookingLastDate(diningEachDayInfo);
        }
        return '9999-12-31';
    }, [diningEachDayInfo]);
    const diningBookingLastDate = new Date(diningBookingLastDateString);

    const [tableBookingDate, setTableBookingDate] = useState(today);
    const [noOfGuests, setNoOfGuests] = useState(1);
    const [mealType, setMealType] = useState("");
    const [tableBookingTime, setTableBookingTime] = useState('');

    const [showValidateBlock, setShowValidateBlock] = useState(true);
    const [validateErrorMessgae, setValidateErrorMessgae] = useState('');
    const [showAddCartBlock, setAddCartBlock] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [isDataSavingToCart, setIsDataSavingToCart] = useState(false);
    const [bookingDetailsForCart, setBookingDetailsForCart] = useState(null);

    // let priceForBooking = 0;
    // if(bookingDetailsForCart != null && diningEachDayInfo != null){
    //     priceForBooking = getTableBookingPriceForCart(diningEachDayInfo, bookingDetailsForCart)
    // }
    const priceForBooking = useMemo(function(){
        if(bookingDetailsForCart != null && diningEachDayInfo != null){
            return getTableBookingPriceForCart(diningEachDayInfo, bookingDetailsForCart)
        }
        return 0;
    }, [diningEachDayInfo, bookingDetailsForCart]);

    // const mealTypeTimeDetails = (diningRestaurantInfo.timing).find(function(element){
    //     return (element.foodCategory === mealType)
    // });
    const mealTypeTimeDetails = useMemo(function(){
        const specificMealTimeDetails = (diningRestaurantInfo.timing).find(function(element){
            return (element.foodCategory === mealType)
        });
        return specificMealTimeDetails;
    }, [mealType]);


    async function fetchDiningEachDayData(){
        try{
            const response = await fetch('/api/hotel-booking-information/dining-information/each-day-information/');
            const data = await response.json(); 
            const allDiningInfo = data.diningWithDate;
            const specificDiningInfoEachDay = fetchSpecificDiningEachDayData(allDiningInfo, diningRestaurantTitle);
            setDiningEachDayInfo(specificDiningInfoEachDay);
        }
        catch(error){
            console.log(error);
        }
    }

    function fetchSpecificDiningEachDayData(allDiningInfo, diningTitle){
        const specificDiningInfo = allDiningInfo.find(function(eachDining){
            return (eachDining.diningTitle == diningTitle);
        });
        return specificDiningInfo;
    }


    function getDiningBookingLastDate(diningInfoEachDay){
        const dateDetailsForDining = diningInfoEachDay.dateDetails;
        dateDetailsForDining.sort(function(d1, d2){
            const date1 = new Date(d1.date);
            const date2 = new Date(d2.date);
            return date2 - date1;
        });
        const lastDate = dateDetailsForDining[0].date.split("T")[0];
        return lastDate;
    }

    function editDetailsBtnClickHandler(){
        setShowValidateBlock(true);
        setAddCartBlock(false);
    }


    function tableIncrementDecrementCounter(tableType, counterButtonType){
        diningTableCountDispatch({ type: counterButtonType, payload: { tableType } });
    }

    function getTableBookingPriceForCart(diningInfoEachDay, bookingDetails){
        const tableBookingDate = convertDateTextToDate(bookingDetails.tableBookingDate).toString();
        const mealBookingType = bookingDetails.mealType;
        console.log(bookingDetails);

        const twoPersonTableCount = bookingDetails.tableBookingCountDetails.tableCountTwoPerson;
        const fourPersonTableCount = bookingDetails.tableBookingCountDetails.tableCountFourPerson;
        const sixPersonTableCount = bookingDetails.tableBookingCountDetails.tableCountSixPerson;

        const dateDetailsForDining = diningInfoEachDay.dateDetails;
        const diningDetailsForBookingDate = dateDetailsForDining.find(function(eachDate){
            const eachDateString = eachDate.date.split("T")[0];
            return eachDateString == tableBookingDate; 
        });
        
        const diningBookingDateFoodCategoryDetails = diningDetailsForBookingDate.foodCategoryDetails;
        const bookingFoodCategoryDetails = diningBookingDateFoodCategoryDetails.find(function(eachCategory){
            return eachCategory.currentFoodCategory == mealBookingType;
        });

        const priceListOnBookingDateCategory = bookingFoodCategoryDetails.currentFoodCategoryPriceList;
        
        const totalPriceForTwo = priceListOnBookingDateCategory.priceEachTableForTwoPerson * twoPersonTableCount;
        const totalPriceForFour = priceListOnBookingDateCategory.priceEachTableForFourPerson * fourPersonTableCount;
        const totalPriceForSix = priceListOnBookingDateCategory.priceEachTableForSixPerson * sixPersonTableCount;
        
        const totalPrice = totalPriceForTwo + totalPriceForFour + totalPriceForSix;
        return totalPrice;
    }


    function validateClickHandlerFunction(){
        const maxGuestForTableSelection = (2 * tableCountTwoPerson) + (4 * tableCountFourPerson) + (6 * tableCountSixPerson);
        if(tableBookingDate != null && noOfGuests >= 1 && mealType != '' && tableBookingTime !=''){
            if(maxGuestForTableSelection >= noOfGuests){
                setValidateErrorMessgae('');
                setShowValidateBlock(false);
                setAddCartBlock(true);
                const tableBookingCountDetails = {
                    tableCountTwoPerson,
                    tableCountFourPerson,
                    tableCountSixPerson
                }
                const bookingDetails = {
                    diningRestaurantTitle,
                    tableBookingDate,
                    noOfGuests,
                    mealType,
                    tableBookingTime,
                    tableBookingCountDetails
                }
                setBookingDetailsForCart(bookingDetails);
            }
            else if(maxGuestForTableSelection < noOfGuests){
                setValidateErrorMessgae(diningSelectionErrorConstants.INSUFFICIENT_TABLES_SELECTED);
            }
        }
        else if(tableBookingDate == null && noOfGuests < 1 && mealType == '' && tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_MEAL_TYPE_BOOKING_TIME_REQUIRED_GUEST_NOT_LESS_THAN_ONE);
        }
        else if(noOfGuests < 1 && mealType == '' && tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.MEAL_TYPE_BOOKING_TIME_REQUIRED_GUEST_NOT_LESS_THAN_ONE);
        }
        else if(tableBookingDate == null && mealType == '' && tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_MEAL_TYPE_BOOKING_TIME_REQUIRED);
        }
        else if(tableBookingDate == null && noOfGuests < 1 && tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_BOOKING_TIME_REQUIRED_GUEST_NOT_LESS_THAN_ONE);
        }
        else if(tableBookingDate == null && noOfGuests < 1 && mealType == ''){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_MEAL_TYPE_REQUIRED_GUEST_NOT_LESS_THAN_ONE);
        }
        else if(tableBookingDate == null && tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_BOOKING_TIME_REQUIRED);
        }
        else if(tableBookingDate == null && noOfGuests < 1){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_REQUIRED_GUEST_NOT_LESS_THAN_ONE);
        }
        else if(tableBookingDate == null && mealType ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_MEAL_TYPE_REQUIRED);
        }
        else if(mealType == '' && tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.MEAL_TYPE_BOOKING_TIME_REQUIRED);
        }
        else if(noOfGuests < 1 && tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.BOOKING_TIME_REQUIRED_GUEST_NOT_LESS_THAN_ONE);
        }
        else if(noOfGuests < 1 && mealType == ''){
            setValidateErrorMessgae(diningSelectionErrorConstants.MEAL_TYPE_REQUIRED_GUEST_NOT_LESS_THAN_ONE);
        }
        else if(tableBookingDate == null){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_REQUIRED);
        }
        else if(noOfGuests < 1){
            setValidateErrorMessgae(diningSelectionErrorConstants.GUEST_NOT_LESS_THAN_ONE);
        }
        else if(mealType == ''){
            setValidateErrorMessgae(diningSelectionErrorConstants.MEAL_TYPE_REQUIRED);
        }
        else if(tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.TABLE_BOOKING_TIME_REQUIRED);
        }
    }

    const validateClickHandler = useCallback(validateClickHandlerFunction, [tableBookingDate, noOfGuests, mealType, tableBookingTime, tableCountTwoPerson, tableCountFourPerson, tableCountSixPerson]);

    
    function addCartClickHandlerFunction() {
        const diningBookingDetails = JSON.parse(JSON.stringify(bookingDetailsForCart));;
        diningBookingDetails.tableBookingDate = convertDateTextToDate(bookingDetailsForCart.tableBookingDate).toString();
        
        const diningDetailsForCart = {
            diningCartId: Date.now(),
            ...diningBookingDetails,
            priceForBooking
        }
        setIsDataSavingToCart(true);
        if(loginUserIdDetails == null){
            dispatch(addNewBookingToDiningCart(diningDetailsForCart));
            setAddedToCart(true);
            setIsDataSavingToCart(false);
        }
        if(loginUserIdDetails !== null){
            addToCartDatabaseClickHandlerFunction(diningDetailsForCart);
        }
    }

    async function addToCartDatabaseClickHandlerFunction(diningDetailsForCart){
        try {
            const loginUserId = loginUserIdDetails.userId;
            const response = await fetch(`/api/add-cart/dining/${loginUserId}`, {
                method: 'POST',
                body: JSON.stringify(diningDetailsForCart),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data = await response.json();
            if(response.status === 200){
                if(data.message === INFORMATION_ADD_TO_CART_SUCCESSFUL){
                    setAddedToCart(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
        finally{
            setIsDataSavingToCart(false);
        }
    }

    const addCartClickHandler = useCallback(addCartClickHandlerFunction, [dispatch, bookingDetailsForCart, priceForBooking]);

    function loginButtonClickHandler(event){
        event.preventDefault();
        const loginPageCalledFrom = `Dining/ ${diningRestaurantTitle} Page`;
        const loginRedirectPage = `/dining/${diningPath}`;
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/login');
    }


    return (
        <div className={styles.reserveDining}>
            <h3>Reserve a Table</h3>
            <form>

                <label htmlFor="dining-date">
                    <div className={styles.eachLabelHeading}>Please Select Date of Dining: </div>
                    <DatePicker 
                        value={tableBookingDate} 
                        minDate={today}
                        maxDate={diningBookingLastDate}
                        format="dd/MM/y"
                        onChange={setTableBookingDate} 
                    />
                </label>

                <label htmlFor="no-of-people">
                    <div className={styles.eachLabelHeading}>Enter Number of People: </div>
                    <input 
                        id="no-of-people" 
                        type="number" 
                        min="1" 
                        value={noOfGuests}
                        onChange={(event)=>setNoOfGuests(event.target.value)}
                    />
                </label>

                <label htmlFor="meal-type">
                    <div className={styles.eachLabelHeading}>Select Meal Type: </div>
                    <select id="meal-type" onChange={(event)=> setMealType(event.target.value)}>
                        <option value="">Please Select</option>
                        {(diningRestaurantInfo.timing).map(function(eachTime){
                            return (
                            <option key={eachTime.foodCategory} 
                                className={styles.eachFoodCategoryStyle} 
                                value={eachTime.foodCategory}
                            >
                                {eachTime.foodCategory}
                            </option>
                            )
                        })}
                    </select>
                </label>

                {mealTypeTimeDetails &&
                <label htmlFor="meal-time">
                    <div className={styles.eachLabelHeading}>Select Meal Time: </div>
                    <div className={styles.allMealTimingContainer}>
                    {(mealTypeTimeDetails.foodSlotTime).map(function(eachTime){
                            return (
                                <div key={eachTime} className={styles.eachMealTimingContainer}>
                                    <input
                                        type="radio" 
                                        id={eachTime}
                                        name="meal-timing"
                                        className={styles.eachMealTimeInput}
                                        value={eachTime}
                                        checked={tableBookingTime === eachTime}
                                        onChange={(event)=> setTableBookingTime(event.target.value)}
                                    />
                                    <label 
                                        htmlFor={eachTime}
                                        className={tableBookingTime === eachTime ? styles.mealTimeChecked : styles.eachMealTimeLabel}
                                    >
                                        {eachTime}
                                    </label>
                                </div>
                            )
                    })} 
                    </div> 
                </label>
                }

                {mealTypeTimeDetails &&
                <div className={styles.tablesDetails}>
                    <p>Select Total Number of Tables</p>
                    <div className={styles.eachTableDetails}>
                        <span className={styles.eachTableTitle}>Tables for Two Guest: </span>
                        <button type="button" disabled={tableCountTwoPerson == 0} onClick={()=> tableIncrementDecrementCounter('twoPersonTableCount', 'Decrement')}> - </button>
                        <span className={styles.eachTableCount}> {tableCountTwoPerson} </span>
                        <button type="button" onClick={()=> tableIncrementDecrementCounter('twoPersonTableCount', 'Increment')}> + </button>
                    </div>
                    <div className={styles.eachTableDetails}>
                        <span className={styles.eachTableTitle}>Tables for Four Guest: </span>
                        <button type="button" disabled={tableCountFourPerson == 0} onClick={()=> tableIncrementDecrementCounter('fourPersonTableCount', 'Decrement')}> - </button>
                        <span className={styles.eachTableCount}> {tableCountFourPerson} </span>
                        <button type="button" onClick={()=> tableIncrementDecrementCounter('fourPersonTableCount', 'Increment')}> + </button>
                    </div>
                    <div className={styles.eachTableDetails}>
                        <span className={styles.eachTableTitle}>Tables for Six Guest: </span>
                        <button type="button" disabled={tableCountSixPerson == 0} onClick={()=> tableIncrementDecrementCounter('sixPersonTableCount', 'Decrement')}> - </button>
                        <span className={styles.eachTableCount}> {tableCountSixPerson} </span>
                        <button type="button" onClick={()=> tableIncrementDecrementCounter('sixPersonTableCount', 'Increment')}> + </button>
                    </div>
                </div>
                }

                
                {showValidateBlock &&
                <div className={styles.buttonContainer}>
                    <Button onClick={validateClickHandler} variant="contained">Validate</Button>
                    {(validateErrorMessgae != '') &&
                    <p className={styles.validateErrorMessgae}>{validateErrorMessgae}</p>
                    }
                </div>
                }

                {(!addedToCart && showAddCartBlock) &&
                <div className={styles.buttonContainer}>

                    <div className={styles.editDetailsBtn}>
                        <Button onClick={editDetailsBtnClickHandler} variant="contained">
                            Want to Edit Details
                        </Button>
                    </div>

                    {!isDataSavingToCart &&
                    <Button onClick={addCartClickHandler} variant="contained">Add to Cart</Button>
                    }

                    {isDataSavingToCart &&
                    <Button variant="contained" disabled>Please Wait...</Button>
                    }
                    <p className={styles.availableSlot}>The Selected Date and Time Slot is available.</p>
                    <p className={styles.availableSlot}>Please Pay {CURRENCY_SYMBOL}{priceForBooking} for Table Booking.</p>
                </div>}
                {addedToCart &&
                <div className={styles.successfullyCartAdded}>
                    <p>Dining Table Successfully Added to Cart</p>
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

export default DiningBookingComponent;