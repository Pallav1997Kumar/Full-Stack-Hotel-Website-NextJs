'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';

import styles from "./Navbar.module.css";

import { useAppSelector, useAppDispatch } from "@/redux store/hooks.js";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";


function Navbar(){
    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    console.log(loginUserDetails);

    const dispatch = useAppDispatch();
    
    let loginUserId;
    let loginUserFullName;

    if(loginUserDetails != null){
        loginUserId = loginUserDetails.userId;
        loginUserFullName = loginUserDetails.fullName;
    } 

    function loginClickHandler(){
        const loginPageCalledFrom = 'Navigation Bar';
        const loginRedirectPage = '/profile-home-page';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
    }

    
    return(
        <div className={styles.navbarContainer}>
            <div className={styles.hotelLogo}>
                <Image src={'/hotel-logo.jpg'} alt="hotel-logo" width={150} height={75} />
            </div>
            <div className={styles.hotelRouting}>
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/rooms-suites/">Rooms & Suites</Link>
                    </li>
                    <li>
                        <Link href="/dining/">Dining</Link>
                    </li>
                    <li>
                        <Link href="/meetings-events/">Event/Meeting Rooms</Link>
                    </li>
                    <li>
                        <Link href="/contactUs">Contact Us</Link>
                    </li>
                    <li>
                        <Link href="/about">About</Link>
                    </li>
                </ul>
            </div>
            {(loginUserId == null) &&
            <div className={styles.loginCartRouting}>
                <ul>
                    <li>
                        <Link href="/cart">My Cart</Link>
                    </li>
                    <li>
                        <Link onClick={loginClickHandler} href="/login">Login</Link>
                    </li>
                </ul>
            </div>
            }
            {(loginUserDetails != null) &&
            <div className={styles.userProfileRouting}>
                <ul>
                    <li>
                        <Link href="/profile-home-page">
                            {loginUserFullName}
                        </Link>
                    </li>
                </ul>
            </div>
            }
        </div>
    );
}

export default Navbar;