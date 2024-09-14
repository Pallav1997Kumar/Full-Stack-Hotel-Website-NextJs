"use client"
import React, { useState, useEffect, useReducer, useMemo, useCallback } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useRouter } from 'next/navigation';

import styles from "./BookingRoomContainer.module.css";

import GuestRoomSection from "./GuestRoomSection.jsx";
import BookingPriceDetails from "./BookingPriceDetails.jsx";
import { getOnlyDate, getOnlyMonth, getOnlyYear, getOnlyDay, nextDay } from "@/functions/date.js";
import { convertDateTextToDate } from "@/functions/date.js";
import { getAllElementsInArrayFormatFromStartToEndOfNumber } from "@/functions/array.js";
import { useAppDispatch, useAppSelector } from "@/redux store/hooks.js";
import { addNewBookingToRoomCart } from "@/redux store/features/Booking Features/roomBookingCartSlice.js";
import { getRoomsSuitesEachDayPrice } from "@/redux store/features/Price Features/roomsSuitesEachDayPriceSlice";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";
import { roomsSuitesSelectionErrorConstants } from "@/constant string files/roomsSuitesSelectionErrorConstants.js";
import { INFORMATION_ADD_TO_CART_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";
import { roomCounterConstant } from "@/constant string files/roomsImportantConstants.js";


const modalBoxStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    bgcolor: 'background.paper',
    border: '4px solid #000',
    boxShadow: 24,
    p: 2,
  };


const initialRoomCount = {
    roomsCount: 1
}

function roomCounterReducer(state, action){
    switch (action.type) {
        case roomCounterConstant.INCREASE:
            return {
                ...state,
                roomsCount: state.roomsCount + 1
            }
            break;

        case roomCounterConstant.DECREASE:
            return {
                ...state,
                roomsCount: state.roomsCount - 1
            }
            break;
    
        default:
            return state;
            break;
    }
}

export default function BookingRoomContainer(props) {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserIdDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    useEffect(()=>{
        dispatch(getRoomsSuitesEachDayPrice());
        fetchRoomsSuitesEachDayData();
    },[]);

    const [roomsWithDateInformation, setRoomsWithDateInformation] = useState(null);

    const roomInfo = props.roomInfo;
    const roomTitle = roomInfo.title;
    const roomPath = roomInfo.path;

    const todayDate = new Date().toISOString().split("T")[0];
    const today = new Date(todayDate);

    const [roomCountState, roomCountDispatch] = useReducer(roomCounterReducer, initialRoomCount);
    const roomsCount = roomCountState.roomsCount;

    const [guestRoomsDetails, setGuestRoomsDetails] = useState([]);
    const [showViewAvailablityButton, setShowViewAvailablityButton] = useState(true);
    const [showAddCartButton, setShowAddCartButton] = useState(false);
    const [showError, setShowError] = useState('');
    const [roomAddedToCart, setRoomAddedToCart] = useState(false);
    const [isDataSavingToCart, setIsDataSavingToCart] = useState(false);
    const [roomsDetailsAddedToCart, setRoomsDetailsAddedToCart] = useState();
    
    // let totalGuestCount = 0;
    // for(let i = 0; i < guestRoomsDetails.length; i++){
    //     totalGuestCount = totalGuestCount + guestRoomsDetails[i].total;
    // }

    const totalGuestCount = useMemo(function(){
        const initialTotalGuestCount = 0;
        const totalNoOfGuest = guestRoomsDetails.reduce(function(accumulator, currValue){
            const currentRoomGuest = currValue.total;
            return accumulator + currentRoomGuest;
        },initialTotalGuestCount);
        return totalNoOfGuest;
    },[guestRoomsDetails]);


    let startingPriceOfRoom = null;
    let roomBookingLastDateString = null;
    let roomBookingLastDate = new Date('9999-12-31')
    if(roomsWithDateInformation != null){
        const dateDetailsOfRoom = roomsWithDateInformation.dateDetails;
        startingPriceOfRoom = getRoomStartingPrice(dateDetailsOfRoom);
        roomBookingLastDateString = getRoomBookingLastDate(dateDetailsOfRoom);
        roomBookingLastDate = new Date(roomBookingLastDateString)
    }

    const [checkinDate, setCheckinDate] = useState(today);
    const defaultCheckoutDate = nextDay(new Date(checkinDate));
    const [checkoutDate, setCheckoutDate] = useState(defaultCheckoutDate);

    const [showCheckinCalender, setShowCheckinCalender] = useState(false);
    const [showCheckoutCalender, setShowCheckoutCalender] = useState(false);

    const [noOfGuests, setNoOfGuests] = useState(0);

    const [showGuestModal, setShowGuestModal] = useState(false);

    
    // const roomsArray = new Array();
    // for(let i = 1; i <= roomsCount; i++){
    //     roomsArray.push(i);
    // }

    const roomsArray = useMemo(function(){
        const arrayOfRoomsNumber = getAllElementsInArrayFormatFromStartToEndOfNumber(roomsCount);
        return arrayOfRoomsNumber;
    }, [roomsCount]);

    const [totalPriceOfAllRooms, setTotalPrice] = useState(0);
    function getTotalPriceOfRoom(totalPriceOfAllRooms){
        setTotalPrice(totalPriceOfAllRooms);
    }

    function loginButtonClickHandler(event){
        event.preventDefault();
        const loginPageCalledFrom = `Rooms and Suites/ ${roomTitle} Page`;
        const loginRedirectPage = `/rooms-suites/${roomPath}`;
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/login');
    }

    async function fetchRoomsSuitesEachDayData(){
        try{
            const response = await fetch('/api/hotel-booking-information/room-and-suites-information/each-day-information/');
            const data = await response.json();
            const allRoomsWithDate = data.roomsWithDate;
            const particularRoomEachDayInfo = allRoomsWithDate.find(function(eachRoomWithDate){
                return eachRoomWithDate.roomTitle == roomTitle
            });
            setRoomsWithDateInformation(particularRoomEachDayInfo);
        }
        catch(error){
            console.log(error);
        }
    }

    function getRoomStartingPrice(dateDetailsOfParticularRoom) {
        dateDetailsOfParticularRoom.sort((a,b) => a.price - b.price);
        const minimumPriceDateDetails = dateDetailsOfParticularRoom[0];
        const minimumPrice = minimumPriceDateDetails.price;
        return minimumPrice;
    }

    function getRoomBookingLastDate(dateDetailsOfRoom){
        dateDetailsOfRoom.sort(function(d1, d2){
            const date1 = new Date(d1.date);
            const date2 = new Date(d2.date);
            return date2 - date1;
        });
        const lastDate = dateDetailsOfRoom[0].date.split("T")[0];
        return lastDate;
    }

    function clickCheckIn(event) {
        setShowCheckinCalender(!showCheckinCalender);
    }

    function clickCheckOut(event) {
        setShowCheckoutCalender(!showCheckoutCalender); 
    }

    function checkinChangeHandlerFunction(date){
        setCheckinDate(date);
        setShowCheckinCalender(!showCheckinCalender);
        setCheckoutDate(nextDay(new Date(date)));
    }

    const checkinChangeHandler = useCallback(checkinChangeHandlerFunction, [showCheckinCalender]);


    function checkoutChangeHandlerFunction(date){
        setCheckoutDate(date);
        setShowCheckoutCalender(!showCheckoutCalender); 
    }

    const checkoutChangeHandler = useCallback(checkoutChangeHandlerFunction, [showCheckoutCalender]);


    function increaseRoomHandler(){
        roomCountDispatch({ type: roomCounterConstant.INCREASE });
    }

    function decreaseRoomHandler(){
        roomCountDispatch({ type: roomCounterConstant.DECREASE });
    }


    function getGuestData(guestRoomData) {
        const isSameRoomNoPresent = guestRoomsDetails.some(function(eachRoom){
            return (eachRoom.roomNo == guestRoomData.roomNo);
        });
        if(isSameRoomNoPresent){
            const oldGuestRoomDetails = guestRoomsDetails.filter(function(eachRoom){
                return (eachRoom.roomNo != guestRoomData.roomNo);
            });
            setGuestRoomsDetails([...oldGuestRoomDetails, guestRoomData]);
        }
        else{
            setGuestRoomsDetails([...guestRoomsDetails, guestRoomData]);
        }
    }


    function guestSaveHandlerFunction(){
        setNoOfGuests(totalGuestCount);
        setShowGuestModal(false);
    }

    const guestSaveHandler = useCallback(guestSaveHandlerFunction, [totalGuestCount]);


    function viewAvalabilityHandlerFunction() { 
        const bookingDetails = {
            roomTitle,
            checkinDate,
            checkoutDate,
            totalRooms: roomsCount,
            totalGuest: noOfGuests,
            guestRoomsDetails
        }
        if(noOfGuests == 0){
            setShowError(roomsSuitesSelectionErrorConstants.GUEST_CANNOT_ZERO);
        }
        
        else if(roomsCount != guestRoomsDetails.length){
            setShowError(roomsSuitesSelectionErrorConstants.ALL_ROOMS_GUEST_DETAILS_REQUIRED);
        }
        else{
            setShowError('');
            setShowAddCartButton(true);
            setRoomsDetailsAddedToCart(bookingDetails);
        }
        setShowViewAvailablityButton(false);
    }

    const viewAvalabilityHandler = useCallback(viewAvalabilityHandlerFunction, [checkinDate, checkoutDate, roomsCount, noOfGuests, guestRoomsDetails]);


    function addCartHandlerFunction() {
        const roomsBookingDetails = JSON.parse(JSON.stringify(roomsDetailsAddedToCart));
        roomsBookingDetails.checkinDate = convertDateTextToDate(roomsDetailsAddedToCart.checkinDate).toString();
        roomsBookingDetails.checkoutDate = convertDateTextToDate(roomsDetailsAddedToCart.checkoutDate).toString();

        const roomsDetailsForCart = {
            roomCartId: Date.now(),
            ...roomsBookingDetails, 
            totalPriceOfAllRooms
        }
        setIsDataSavingToCart(true);
        console.log(roomsDetailsForCart);
        if(loginUserIdDetails == null){
            dispatch(addNewBookingToRoomCart(roomsDetailsForCart));
            setRoomAddedToCart(true);
            setIsDataSavingToCart(false);
        }
        if(loginUserIdDetails !== null){
            addToCartDatabaseHandlerFunction(roomsDetailsForCart);
        }  
    }

    async function addToCartDatabaseHandlerFunction(roomsDetailsForCart){  
        try {
            const loginUserId = loginUserIdDetails.userId;
            const response = await fetch(`/api/add-cart/rooms-suites/${loginUserId}`, {
                method: 'POST',
                body: JSON.stringify(roomsDetailsForCart),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data = await response.json();
            if(response.status === 200){
                if(data.message === INFORMATION_ADD_TO_CART_SUCCESSFUL){
                    setRoomAddedToCart(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
        finally{
            setIsDataSavingToCart(false);
        }
    }

    const addCartHandler = useCallback(addCartHandlerFunction, [dispatch, roomsDetailsAddedToCart, totalPriceOfAllRooms]);
   
    
    
    return (
        <div className={styles.book}>
            <h3>Book your Stay</h3>
            <div className={styles.bookBox}>
                <div className={styles.checkinCheckout}>
                    <div className={styles.checkin}>
                        <div className={styles.checkInfo} onClick={clickCheckIn}>
                            <p className={styles.checkTitle}>Checkin</p>
                            <p className={styles.checkDate}>{getOnlyDate(checkinDate)}</p>
                            <p>{getOnlyMonth(checkinDate)} {getOnlyYear(checkinDate)}</p>
                            <p>{getOnlyDay(checkinDate)}</p>
                        </div>
                        {showCheckinCalender && 
                        <Calendar 
                            onChange={checkinChangeHandler} 
                            minDate={today} 
                            maxDate={roomBookingLastDate}
                            value={checkinDate} 
                        />
                        }
                    </div>
                    <div className={styles.checkout}>
                        <div className={styles.checkInfo} onClick={clickCheckOut}>
                            <p className={styles.checkTitle}>Checkout</p>
                            <p className={styles.checkDate}>{getOnlyDate(checkoutDate)}</p>
                            <p>{getOnlyMonth(checkoutDate)} {getOnlyYear(checkoutDate)}</p>
                            <p>{getOnlyDay(checkoutDate)}</p>
                        </div>
                        {showCheckoutCalender && 
                        <Calendar 
                            onChange={checkoutChangeHandler} 
                            minDate={nextDay(checkinDate)} 
                            maxDate={nextDay(roomBookingLastDate)}
                            value={checkoutDate} 
                        />
                        }
                    </div>
                </div>
                <div className={styles.roomsGuests}>
                    <div className={styles.rooms}>
                        <p>Rooms</p>
                        <button disabled={roomsCount==1} onClick={decreaseRoomHandler}> - </button>
                        <span className={styles.displayRooms}>{roomsCount}</span>
                        <button onClick={increaseRoomHandler}> + </button>
                    </div>
                    <div className={styles.guests}>
                        <div className={styles.guestBasic}>
                            <p>Guests</p>
                            <p>{noOfGuests}</p>
                            <p className={styles.editGuest} onClick={()=> setShowGuestModal(true)}>Edit Guest Details</p>
                        </div>
                        <Modal 
                            open={showGuestModal} 
                            onClose={()=>setShowGuestModal(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={modalBoxStyle}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Please find the details of guests for each room
                                </Typography>                           
                                <Typography id="modal-modal-description">
                                    <div className={styles.guestDetails}>
                                        {roomsArray.map(function(element){
                                            const roomGuestDetails = guestRoomsDetails.find(function(eachRoom){
                                                return (eachRoom.roomNo == element);
                                            });
                                            return (
                                                <GuestRoomSection 
                                                    key={element} 
                                                    roomNo={element} 
                                                    roomTitle={roomTitle}
                                                    onGetGuestDataParticularRoom={getGuestData} 
                                                    roomGuestDetails={roomGuestDetails} 
                                                />
                                            )
                                        })}
                                    </div>
                                    <Button variant="outlined" onClick={()=>setShowGuestModal(false)}>
                                        Close
                                    </Button>
                                    <Button variant="outlined" onClick={guestSaveHandler}>
                                        Save Changes
                                    </Button>
                                </Typography>
                            </Box>
                        </Modal>
                    </div>
                </div>
                {showViewAvailablityButton && 
                <div className={styles.viewAvalabilityButton}>
                    <Button onClick={viewAvalabilityHandler} variant="contained">
                        View Availability
                    </Button>
                </div>
                }
                {(showError != '' && !showViewAvailablityButton) &&
                <div className={styles.errorBlock}>
                    <p>{showError}</p>
                    <Button variant="contained" onClick={()=>setShowViewAvailablityButton(true)}>
                        Close
                    </Button>
                </div>
                }
                {(!showViewAvailablityButton && showAddCartButton && !roomAddedToCart) && 
                <div className={styles.addCartButton}>
                    <p>The Room is available on Choosen Date</p>
                    <BookingPriceDetails 
                        roomDetailsForCart={roomsDetailsAddedToCart} 
                        setTotalPriceOfRoom={getTotalPriceOfRoom} 
                    />
                    <div className={styles.editRoomInfoBtn}>
                        <Button onClick={()=>setShowViewAvailablityButton(true)} variant="contained">
                            Edit Room Info
                        </Button>
                    </div>
                    {!isDataSavingToCart &&
                    <Button onClick={addCartHandler} variant="contained">
                        Add to Cart 
                    </Button>
                    }

                    {isDataSavingToCart &&
                    <Button variant="contained" disabled>Please Wait</Button>
                    }
                </div>
                }

                
                {roomAddedToCart && 
                <div className={styles.successfullyAddedCart}>
                    <p>Room has been Successfully Added to Cart</p>
                </div>
                }

                {loginUserIdDetails === null &&
                <div className={styles.loginContainer}>
                    <Button onClick={loginButtonClickHandler} variant="contained">Proceed to Login</Button>
                </div>
                }
            </div>
            
        </div>
    );
}

