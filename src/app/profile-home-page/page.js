'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from "./page.module.css";

import { logout } from "@/redux store/features/Auth Features/loginUserDetailsSlice.js";
import { useAppSelector, useAppDispatch } from "@/redux store/hooks.js";


export default function page(){

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    let loginUserId;
    let loginUserFullName;

    if(loginUserDetails != null){
        loginUserId = loginUserDetails.userId;
        loginUserFullName = loginUserDetails.fullName;
    }  
    
    const dispatch = useAppDispatch();
    const router = useRouter();


    async function logoutHandler() {
        try {
            const response = await fetch(`/api/users-authentication/customers-authenticatication/logout`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data = await response.json();
            if(response.status === 200){
                router.push('/login');
                dispatch(logout());
                localStorage.removeItem('loginUserDetails');
            }
        } catch (error) {
            
        }
    }
    

    return (
        <div className={styles.profileHomePage}>
            <h1>Welcome</h1>
            <h3>{loginUserFullName}</h3>
            
            <div className={styles.proileOptions}>
                <ul>
                    <li>
                        <Link href={`/profile-home-page/edit-personal-information/${loginUserId}`}>
                            Edit Personal Information
                        </Link>
                    </li>
                    <li>
                        <Link href={`/profile-home-page/change-password/${loginUserId}`}>
                            Change Account Password
                        </Link>
                    </li>
                    <li>
                        <Link href='/'>My Carts</Link>
                    </li>
                    <li>
                        <Link href='/'>View Past Bookings</Link>
                    </li>
                    <li>
                        <Link href={`/profile-home-page/view-account-balance/${loginUserId}`}>View Account Balance</Link>
                    </li>
                    <li>
                        <Link href={`/profile-home-page/add-money-account/${loginUserId}`}>Add Money to Account</Link>
                    </li>
                    <li onClick ={logoutHandler}>Logout</li>
                </ul>
            </div>
        </div>
    )
}


