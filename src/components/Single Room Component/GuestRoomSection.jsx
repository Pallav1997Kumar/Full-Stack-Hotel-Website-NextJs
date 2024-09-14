"use client"
import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';

import styles from "./GuestRoomSection.module.css";

import { guestTitleConstant } from "@/constant string files/roomsImportantConstants.js";


export default function GuestRoomSection(props){
    const roomNo = props.roomNo;
    const roomGuestDetails = props.roomGuestDetails;
    const roomTitle = props.roomTitle;

    useEffect(()=>{
        fetchRoomGuestInfo();
    },[]);

    const [guestCountOfRoom, setGuestCountOfRoom] = useState(null);
    const [editGuestDetails, setEditGuestDetails] = useState(false);
    const [noOfChildParticularRoom, setNoOfChildParticularRoom] = useState(roomGuestDetails?.noOfChildren || 0);
    const [noOfAdultParticularRoom, setNoOfAdultParticularRoom] = useState(roomGuestDetails?.noOfAdult || 0);
    const totalParticularRoom = noOfAdultParticularRoom + noOfChildParticularRoom;
    // console.log(guestCountOfRoom);

    let maxAdultGuestCount = 0;
    let maxChildGuestCount = 0;
    if(guestCountOfRoom != null && Array.isArray(guestCountOfRoom)){
        guestCountOfRoom.forEach(function(eachGuestTitle){
            if(eachGuestTitle.guestTitle == guestTitleConstant.ADULT){
                maxAdultGuestCount = eachGuestTitle.maximumGuest;
            }
            if(eachGuestTitle.guestTitle == guestTitleConstant.CHILDREN){
                maxChildGuestCount = eachGuestTitle.maximumGuest;
            }
        });
    }

    const adultGuestCountArray = [];
    const childGuestCountArray = [];
    if(maxAdultGuestCount > 0){
        for(let i = 1; i <= maxAdultGuestCount; i++){
            adultGuestCountArray.push(i);
        }
    }

    if(maxChildGuestCount > 0){
        for(let i = 0; i <= maxChildGuestCount; i++){
            childGuestCountArray.push(i);
        }
    }
    // console.log(adultGuestCountArray);
    // console.log(childGuestCountArray);

    async function fetchRoomGuestInfo(){
        try{
            const response = await fetch('/api/hotel-booking-information/room-and-suites-information/hotel-rooms-guest-count/');
            const data = await response.json();
            const allRoomsData = data.roomsGuestInfo;
            const guestDetails = fetchSpecificRoomGuestInfo(allRoomsData,roomTitle);
            setGuestCountOfRoom(guestDetails);
        }
        catch(error){
            console.log(error);
        }
    }

    function fetchSpecificRoomGuestInfo(allRoomsInfo, titleOfRoom){
        const specificRoomInfo = allRoomsInfo.find(function(eachRoom){
            return eachRoom.title == titleOfRoom;
        });
        const guestDetails = specificRoomInfo.guestCount;
        return guestDetails;
    }

    function buttonClickHandler(){
        setEditGuestDetails(false);
        const particularRoomInfo = {
            roomNo: roomNo,
            noOfAdult: noOfAdultParticularRoom,
            noOfChildren: noOfChildParticularRoom,
            total: totalParticularRoom
        };
        props.onGetGuestDataParticularRoom(particularRoomInfo);
    }


    return (
        <div className={styles.eachRoom}>
            <p>Room {roomNo}</p>

            {!editGuestDetails &&
            <div>
                <span className={styles.adultInfo}>{noOfAdultParticularRoom} Adults, </span>
                <span className={styles.childInfo}>{noOfChildParticularRoom} Children </span>
                <span className={styles.totalInfo}> Total: {totalParticularRoom} </span>
                <span className={styles.edit} onClick={()=> setEditGuestDetails(true)}>Edit</span>
            </div>}

            {editGuestDetails && 
            <div>
                <span className={styles.guestCategoryAdult}>Adults</span>
                {/* {(noOfAdultParticularRoom == 1) ? 
                    (<span className={styles.countNumberGuestActive}>1</span>) : 
                    (<span onClick={()=>setNoOfAdultParticularRoom(1)} className={styles.countNumberGuest}>1</span>)
                }
                {(noOfAdultParticularRoom == 2) ? 
                    (<span className={styles.countNumberGuestActive}>2</span>) : 
                    (<span onClick={()=>setNoOfAdultParticularRoom(2)} className={styles.countNumberGuest}>2</span>)
                } */}

                {adultGuestCountArray.map(function(eachCount){
                    if(noOfAdultParticularRoom == eachCount){
                        return (
                            <span className={styles.countNumberGuestActive}> {eachCount} </span>
                        );
                    }
                    else{
                        return (
                            <span onClick={()=>setNoOfAdultParticularRoom(eachCount)} className={styles.countNumberGuest}> {eachCount} </span>
                        );
                    }
                })}

                <span className={styles.guestCategoryChildren}>Children</span>
                {/* {(noOfChildParticularRoom == 0) ? 
                    (<span className={styles.countNumberGuestActive}>0</span>) : 
                    (<span onClick={()=>setNoOfChildParticularRoom(0)} className={styles.countNumberGuest}>0</span>)
                }
                {(noOfChildParticularRoom == 1) ? 
                    (<span className={styles.countNumberGuestActive}>1</span>) : 
                    (<span onClick={()=>setNoOfChildParticularRoom(1)} className={styles.countNumberGuest}>1</span>)
                }
                {(noOfChildParticularRoom == 2) ? 
                    (<span className={styles.countNumberGuestActive}>2</span>) : 
                    (<span onClick={()=>setNoOfChildParticularRoom(2)} className={styles.countNumberGuest}>2</span>)
                } */}

                {childGuestCountArray.map(function(eachCount){
                    if(noOfChildParticularRoom == eachCount){
                        return (
                            <span className={styles.countNumberGuestActive}> {eachCount} </span>
                        );
                    }
                    else{
                        return (
                            <span onClick={()=>setNoOfChildParticularRoom(eachCount)} className={styles.countNumberGuest}> {eachCount} </span>
                        );
                    }
                })}     
            
                <span className={styles.guestCategoryTotal}>Total</span>
                <span>{totalParticularRoom}</span>
                <span className={styles.button}>
                    <Button disabled={noOfAdultParticularRoom < 1} color="secondary" onClick={buttonClickHandler}>Done</Button>
                </span>
            </div>}
        </div>
    );
}