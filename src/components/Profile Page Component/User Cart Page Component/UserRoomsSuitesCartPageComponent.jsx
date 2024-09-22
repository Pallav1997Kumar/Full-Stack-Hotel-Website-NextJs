'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import styles from './UserDiningRoomsSuitesEventMeetingStyle.module.css';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import UserRoomSuiteBookingCart from "@/components/User Carts Component/UserRoomSuiteBookingCart.jsx";
import { addRoomSuiteBookingInfo, resetRoomSuiteBookingInfo } from "@/redux store/features/Booking Information/roomSuiteBookingInfoSlice.js";
import { ROOMS_SUITES_PRESENT_IN_CART, ROOMS_SUITES_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";


function UserRoomsSuitesCartPageComponent(){

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(()=>{
        fetchRoomSuiteCartDb(loginUserId);
        dispatch(resetRoomSuiteBookingInfo());
    }, []);

    const [loadingCartDetails, setLoadingCartDetails] = useState(true);
    const [proceedBtnClickable, setProceedBtnClickable] = useState(true);

    const [roomSuitesCart, setRoomSuitesCart] = useState(null);
    const [roomSuiteCartIdList, setRoomSuiteCartIdList] = useState([]);

    async function fetchRoomSuiteCartDb(loginUserId) {
        try {
            const response = await fetch(`/api/view-cart/rooms-suites/search-by-user-id/${loginUserId}`);
            const data = await response.json();
            
            if(response.status === 200){
                if(data.message === ROOMS_SUITES_CART_IS_EMPTY){
                    const roomSuitesCartDb = null;
                    setRoomSuitesCart(roomSuitesCartDb);
                }
                else if(data.message === ROOMS_SUITES_PRESENT_IN_CART){
                    const roomSuitesCartDb = data.roomSuiteCartInfo;
                    setRoomSuitesCart(roomSuitesCartDb);
                }
            }
        } 
        catch (error) {
            console.log(error);
        }
        finally{
            setLoadingCartDetails(false);
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

    function getRoomsSuiteCheckedItemsId(idList){
        setRoomSuiteCartIdList(idList);
    }


    async function addToRoomSuiteBookingHandler(){ 
        const roomSuitesPaymentCartList = [];
        setProceedBtnClickable(false);
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
            const redirectPage = `/proceed-booking/rooms-suites/${loginUserId}`;
            router.push(redirectPage);
            setProceedBtnClickable(true);
        }
    }


    if(!loadingCartDetails && roomSuitesCart !== null && roomSuitesCart.length == 0){
        return (
            <React.Fragment>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

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
                        <span>{'>>'}</span>
                        <Link href={`/profile-home-page/my-cart/rooms-suites/${loginUserId}`}> 
                            <span className={styles.breadcrumbsLink}> MY ACCOUNT ROOMS AND SUITES CART </span>
                        </Link>
                    </p>
                </div>

                <div className={styles.emptyCart}>
                    <p>Rooms And Suites Cart is Empty</p>
                    <p>Click on Below Button to Add Items</p>
                    <Link href={`/rooms-suites/`} passHref>
                        <Button variant="contained">Rooms And Suites Page</Button>
                    </Link>
                </div>
            </React.Fragment>
        );
    }

    return (
        <div>
            <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

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
                    <span>{'>>'}</span>
                    <Link href={`/profile-home-page/my-cart/rooms-suites/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> MY ACCOUNT ROOMS AND SUITES CART </span>
                    </Link>
                </p>
            </div>

            {loadingCartDetails &&
                <div className={styles.loadingCart}>
                    <p> LOADING CART ...</p>
                </div>
            }

            <div className={styles.diningRoomsEventContainer}>
                {(!loadingCartDetails && roomSuitesCart !== null && roomSuitesCart.length > 0) &&
                    <UserRoomSuiteBookingCart 
                        roomSuitesCart={roomSuitesCart} 
                        onGetCheckIdRoomsSuitesCart={getRoomsSuiteCheckedItemsId}
                        onRemoveRoomsSuitesItemFromCart={removeRoomsSuitesItemFromCartDb}
                    />
                }

                {(roomSuitesCart !== null && roomSuitesCart.length > 0 && roomSuiteCartIdList.length > 0) &&
                    <div className={styles.addCartBtn}>
                        {proceedBtnClickable && 
                            <Button onClick={addToRoomSuiteBookingHandler} variant="contained">
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

                {(roomSuitesCart !== null && roomSuitesCart.length > 0 && roomSuiteCartIdList.length == 0) &&
                    <div className={styles.addCartBtn}>
                        <Button disabled variant="contained">
                            Procced For Booking
                        </Button>
                    </div>
                }
            </div>
        </div>
    );

}

export default UserRoomsSuitesCartPageComponent;