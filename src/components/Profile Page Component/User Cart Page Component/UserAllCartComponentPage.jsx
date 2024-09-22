'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

import styles from './UserAllCartComponentPage.module.css';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import UserRoomSuiteBookingCart from "@/components/User Carts Component/UserRoomSuiteBookingCart.jsx";
import UserDiningBookingCart from "@/components/User Carts Component/UserDiningBookingCart.jsx";
import UserEventMeetingBookingCart from "@/components/User Carts Component/UserEventMeetingBookingCart.jsx";
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";
import { ROOMS_SUITES_PRESENT_IN_CART, ROOMS_SUITES_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import { EVENT_MEETING_ROOM_PRESENT_IN_CART, EVENT_MEETING_ROOM_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import { DINING_PRESENT_IN_CART, DINING_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import { addEventMeetingBookingInfo, resetEventMeetingBookingInfo } from "@/redux store/features/Booking Information/eventMeetingBookingInfoSlice.js";
import { addRoomSuiteBookingInfo, resetRoomSuiteBookingInfo } from "@/redux store/features/Booking Information/roomSuiteBookingInfoSlice.js";
import { addDiningBookingInfo, resetDiningBookingInfo } from "@/redux store/features/Booking Information/diningBookingInfoSlice.js";


function UserAllCartComponentPage(){
    
    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    const dispatch = useAppDispatch();
    const router = useRouter();

    const [loadingCartDetails, setLoadingCartDetails] = useState(true);
    const [proceedBtnClickable, setProceedBtnClickable] = useState(true);

    useEffect(()=>{
        fetchAllCartDetails(loginUserId);
        dispatch(resetEventMeetingBookingInfo());
        dispatch(resetRoomSuiteBookingInfo());
        dispatch(resetDiningBookingInfo());
    }, []);

    const [roomSuitesCart, setRoomSuitesCart] = useState(null);
    const [diningCart, setDiningCart] = useState(null);
    const [eventMeetingCart, setEventMeetingCart] = useState(null);

    const [roomSuiteCartIdList, setRoomSuiteCartIdList] = useState([]);
    const [eventMeetingCartIdList, setEventMeetingCartIdList] = useState([]);
    const [diningCartIdList, setDiningCartIdList] = useState([]);


    async function fetchAllCartDetails(loginUserId) {
        try {
            await fetchRoomSuiteCartDb(loginUserId);
            await fetchDiningCartDb(loginUserId);
            await fetchEventMeetingCartDb(loginUserId);
        } 
        catch (error) {
            console.log(error);
        }
        finally{
            setLoadingCartDetails(false);
        }
    }

    async function fetchRoomSuiteCartDb(loginUserId) {
        try {
            const response = await fetch(`/api/view-cart/rooms-suites/search-by-user-id/${loginUserId}`);
            const data = await response.json();
            
            if(response.status === 200){
                if(data.message === ROOMS_SUITES_CART_IS_EMPTY){
                    const roomSuitesCartDb = [];
                    setRoomSuitesCart(roomSuitesCartDb);
                }
                else if(data.message === ROOMS_SUITES_PRESENT_IN_CART){
                    const roomSuitesCartDb = data.roomSuiteCartInfo;
                    setRoomSuitesCart(roomSuitesCartDb);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchDiningCartDb(loginUserId) {
        try {
            const response = await fetch(`/api/view-cart/dining/search-by-user-id/${loginUserId}`);
            const data = await response.json();
            if(response.status === 200){
                if(data.message === DINING_CART_IS_EMPTY){
                    const diningCartDb = [];
                    setDiningCart(diningCartDb);
                }
                else if(data.message === DINING_PRESENT_IN_CART){
                    const diningCartDb = data.diningCartInfo;
                    setDiningCart(diningCartDb);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchEventMeetingCartDb(loginUserId) {
        try {
            const response = await fetch(`/api/view-cart/meeting-events/search-by-user-id/${loginUserId}`);
            const data = await response.json();
            if(response.status === 200){
                if(data.message === EVENT_MEETING_ROOM_CART_IS_EMPTY){
                    const eventMeetingCartDb = [];
                    setEventMeetingCart(eventMeetingCartDb);
                }
                else if(data.message === EVENT_MEETING_ROOM_PRESENT_IN_CART){
                    const eventMeetingCartDb = data.eventMeetingCartInfo;
                    setEventMeetingCart(eventMeetingCartDb);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    async function removeDiningItemFromCartDb(id) {
        try {
            const response = await fetch(`/api/delete-cart/dining/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data = await response.json();   
            if(response.status !== 200){

            }  
            if(response.status === 200){
                await fetchDiningCartDb(loginUserId);
            }
        } 
        catch (error) {
            console.log(error);
        }
    }


    async function removeRoomsSuitesItemFromCartDb(id){
        try {
            const response = await fetch(`/api/delete-cart/rooms-suites/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data = await response.json();   
            if(response.status !== 200){
            }  
            if(response.status === 200){
                await fetchRoomSuiteCartDb(loginUserId);
            }   
        } 
        catch (error) {
            console.log(error);
        }
    }


    async function removeEventMeetingItemFromCart(id, bookingType){
        if(bookingType === roomBookingDateTypeConstants.SINGLE_DATE){
            await removeEventMeetingSingleDateItemFromCartDb(id);
        }
        else if(bookingType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS){
            await removeEventMeetingMultipleDatesContinuousItemFromCartDb(id);
        }
        else if(bookingType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS){
            await removeEventMeetingMultipleDatesNonContinuousItemFromCartDb(id);
        }
    }


    async function removeEventMeetingSingleDateItemFromCartDb(id){
        try {
            const response = await fetch(`/api/delete-cart/meeting-events/single-date/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data = await response.json();   
            if(response.status !== 200){
                
            } 
            if(response.status === 200){
                await fetchEventMeetingCartDb(loginUserId);
            } 
        } 
        catch (error) {
            console.log(error);
        }
    }


    async function removeEventMeetingMultipleDatesContinuousItemFromCartDb(id){
        try {
            const response = await fetch(`/api/delete-cart/meeting-events/multiple-dates-continous/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data = await response.json();   
            if(response.status !== 200){
            }  
            if(response.status === 200){
                await fetchEventMeetingCartDb(loginUserId);
            } 
        } 
        catch (error) {
            console.log(error);
        }
    }


    async function removeEventMeetingMultipleDatesNonContinuousItemFromCartDb(id){
        try {
            const response = await fetch(`/api/delete-cart/meeting-events/multiple-dates-non-continous/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data = await response.json();   
            if(response.status !== 200){
            }  
            if(response.status === 200){
                await fetchEventMeetingCartDb(loginUserId);
            } 
        } 
        catch (error) {
            console.log(error);
        }
    }



    function getDiningCheckedItemsId(idList){
        setDiningCartIdList(idList);
    }

    function getRoomsSuiteCheckedItemsId(idList){
        setRoomSuiteCartIdList(idList);
    }

    function getEventMeetingCheckedItemsId(idList){
        setEventMeetingCartIdList(idList);
    }


    async function addToDiningBookingHandler(){ 
        const diningPaymentCartList = [];
        try{
            const fetchDiningCartPromise = diningCartIdList.map(async function(eachDiningCartId){
                const diningCartResponse = await fetch(`/api/view-cart/dining/search-by-cart-id/${eachDiningCartId}`);
                const diningCartData = await diningCartResponse.json();
                return diningCartData;
            });
            const diningCartPromiseResult = await Promise.all(fetchDiningCartPromise);
            diningCartPromiseResult.forEach(function(eachDiningCartPromise){
                diningPaymentCartList.push(eachDiningCartPromise);
            });
        }
        catch(error){
            console.log(error);
        }
        finally{
            dispatch(addDiningBookingInfo(diningPaymentCartList));
        }
    }

    async function addToRoomSuiteBookingHandler(){ 
        const roomSuitesPaymentCartList = [];
        try{
            const fetchRoomSuiteCartPromise = roomSuiteCartIdList.map(async function(eachRoomSuiteCartId){
                const roomSuitesCartResponse = await fetch(`/api/view-cart/rooms-suites/search-by-cart-id/${eachRoomSuiteCartId}`);
                const roomSuitesCartData = await roomSuitesCartResponse.json();
                return roomSuitesCartData;
            });
            const roomSuitesCartPromiseResult = await Promise.all(fetchRoomSuiteCartPromise);
            roomSuitesCartPromiseResult.forEach(function(eachRoomSuiteCartPromise){
                roomSuitesPaymentCartList.push(eachRoomSuiteCartPromise);
            });
        }
        catch(error){

        }
        finally{
            dispatch(addRoomSuiteBookingInfo(roomSuitesPaymentCartList));
        }
    }

    async function addToEventMeetingBookingHandler(){
        const eventMeetingPaymentCartList = [];
        try{
            const fetchEventMeetingCartPromise = eventMeetingCartIdList.map(async function(eachEventMeetingCartId){
                if(eachEventMeetingCartId.roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE){
                    const eventMeetingCartResponse = await fetch(`/api/view-cart/meeting-events/search-by-cart-id/single-date/${eachEventMeetingCartId.id}`);
                    const eventMeetingCartData = await eventMeetingCartResponse.json();
                    return eventMeetingCartData;
                }
                else if(eachEventMeetingCartId.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS){
                    const eventMeetingCartResponse = await fetch(`/api/view-cart/meeting-events/search-by-cart-id/multiple-dates-continous/${eachEventMeetingCartId.id}`);
                    const eventMeetingCartData = await eventMeetingCartResponse.json();
                    return eventMeetingCartData;
                }
                else if(eachEventMeetingCartId.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS){
                    const eventMeetingCartResponse = await fetch(`/api/view-cart/meeting-events/search-by-cart-id/multiple-dates-non-continous/${eachEventMeetingCartId.id}`);
                    const eventMeetingCartData = await eventMeetingCartResponse.json();
                    return eventMeetingCartData;
                }
            });
            const eventMeetingCartPromiseResult = await Promise.all(fetchEventMeetingCartPromise);
            eventMeetingCartPromiseResult.forEach(function(eachEventMeetingCartPromise){
                eventMeetingPaymentCartList.push(eachEventMeetingCartPromise);
            });
        }
        catch(error){
            console.log(error);
        }
        finally{
            dispatch(addEventMeetingBookingInfo(eventMeetingPaymentCartList));
            console.log(eventMeetingPaymentCartList);
            const redirectPage = `/proceed-booking/events-meetings/${loginUserId}`;
            router.push(redirectPage);
        }
    }


    async function addToBookingHandler(){
        try{
            setProceedBtnClickable(false);
            if(diningCartIdList.length > 0){
                await addToDiningBookingHandler();
            }
            if(roomSuiteCartIdList.length > 0){
                await addToRoomSuiteBookingHandler();
            }
            if(eventMeetingCartIdList.length > 0){
                await addToEventMeetingBookingHandler();
            }
        }
        catch(error){
            console.log(error);
        }
        finally{
            const redirectPage = `/proceed-booking/${loginUserId}`;
            router.push(redirectPage);
            setProceedBtnClickable(true);
        }
    }



    return (
        <React.Fragment>

            <div>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />
            </div>

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
                    <Link href={`/profile-home-page/my-cart/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> MY ACCOUNT CART </span>
                    </Link>
                </p>
            </div>

            <div className={styles.myCart}>
                <h2>MY CARTS</h2>

                <div className={styles.categoryCart}>
                    <h4>Category Wise Cart</h4>
                    <ol>
                        <li>
                            <Link href={`/profile-home-page/my-cart/rooms-suites/${loginUserId}`}>
                                Rooms & Suites Cart
                            </Link>
                        </li>
                        <li>
                            <Link href={`/profile-home-page/my-cart/dining/${loginUserId}`}>
                                Dining Cart
                            </Link>
                        </li>
                        <li>
                            <Link href={`/profile-home-page/my-cart/event-meeting-rooms/${loginUserId}`}>
                                Events/ Meeting Rooms Cart
                            </Link>
                        </li>
                    </ol>
                </div>

                <div className={styles.allCart}>
                    <h3>All Carts</h3>

                    {loadingCartDetails &&
                        <div className={styles.loadingCart}>
                            <p> LOADING CART ...</p>
                        </div>
                    }
                    
                    {(!loadingCartDetails &&
                        (roomSuitesCart !== null && roomSuitesCart.length == 0) && 
                        (diningCart !== null && diningCart.length == 0) && 
                        (eventMeetingCart !== null && eventMeetingCart.length == 0)) &&
                        <div className={styles.emptyCart}>
                            <p>Your Cart is Empty</p>
                            <p>Add Items in Your Cart</p>
                        </div>
                    }

                    {(!loadingCartDetails && roomSuitesCart !== null && roomSuitesCart.length > 0) &&
                        <UserRoomSuiteBookingCart 
                            roomSuitesCart={roomSuitesCart}
                            onGetCheckIdRoomsSuitesCart={getRoomsSuiteCheckedItemsId} 
                            onRemoveRoomsSuitesItemFromCart={removeRoomsSuitesItemFromCartDb}
                        />
                    }

                    {(!loadingCartDetails && diningCart !== null && diningCart.length > 0) &&
                        <UserDiningBookingCart 
                            diningCart={diningCart} 
                            onGetCheckIdDiningCart={getDiningCheckedItemsId}
                            onRemoveDiningItemFromCart={removeDiningItemFromCartDb}
                        />
                    }

                    {(!loadingCartDetails && eventMeetingCart !== null && eventMeetingCart.length > 0) &&
                        <UserEventMeetingBookingCart 
                            eventMeetingCart={eventMeetingCart} 
                            onGetCheckIdEventMeetingCart={getEventMeetingCheckedItemsId}
                            onRemoveEventMeetingItemFromCart={removeEventMeetingItemFromCart}
                        />
                    }


                    {((roomSuitesCart !== null && roomSuitesCart.length > 0) || 
                        (diningCart !== null && diningCart.length > 0) ||
                        (eventMeetingCart !== null && eventMeetingCart.length > 0)) &&
                        <div className={styles.addCartBtn}>

                            {(eventMeetingCartIdList.length > 0 || diningCartIdList.length > 0 || roomSuiteCartIdList.length > 0) &&
                                <div>
                                    {proceedBtnClickable &&
                                        <Button onClick={addToBookingHandler} variant="contained">
                                            Procced For Booking
                                        </Button>
                                    }
                                    {!proceedBtnClickable &&
                                        <Button disabled variant="contained">
                                            Please Wait
                                        </Button>
                                    }
                                </div>   
                            }

                            {(!loadingCartDetails && eventMeetingCartIdList.length == 0 && diningCartIdList.length == 0 && roomSuiteCartIdList.length == 0) &&
                                <Button disabled variant="contained">
                                    Procced For Booking
                                </Button>
                            }

                        </div>
                    }

                </div>

            </div>
        </React.Fragment>
    );
}


export default UserAllCartComponentPage;