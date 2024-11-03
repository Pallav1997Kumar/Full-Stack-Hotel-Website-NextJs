'use client'
import React, { useState } from "react";

import styles from './UserBookingComponent.module.css';

import EachRoomBookingInfo from "@/components/Booking Information Component/Rooms Suites Booking/EachRoomBookingInfo.jsx"
import EachDiningBookingInfo from "@/components/Booking Information Component/Dining Booking/EachDiningBookingInfo.jsx";
import EachEventMeetingBookingInfo from "@/components/Booking Information Component/Event Meeting Booking/EachEventMeetingBookingInfo.jsx";
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";
import { 
    DATE_BOOKED_ASCENDING, 
    DATE_BOOKED_DESCENDING,
    TITLE_ASCENDING,
    TITLE_DESCENDING,
    DATE_OF_BOOKING_ASCENDING,
    DATE_OF_BOOKING_DESCENDING,
    TOTAL_PRICE_ASCENDING,
    TOTAL_PRICE_DESCENDING,
    NUMBER_OF_GUESTS_ASCENDING,
    NUMBER_OF_GUESTS_DESCENDING 
} from "@/constant string files/bookingViewSortingConstants.js";


function UserAllBookingComponent(props){

    const allBookingInfo = props.allBookingInfo;

    const [sortSelection, setSortSelection] = useState("");

    if(sortSelection !== ""){

        if(sortSelection === DATE_BOOKED_ASCENDING){
            allBookingInfo.sort(function(a,b){
                const dateA = new Date(a.transactionDetails.transactionDateTime);
                const dateB = new Date(b.transactionDetails.transactionDateTime);
                return  dateA - dateB;
            });
        }
        else if(sortSelection === DATE_BOOKED_DESCENDING){
            allBookingInfo.sort(function(a,b){
                const dateA = new Date(a.transactionDetails.transactionDateTime);
                const dateB = new Date(b.transactionDetails.transactionDateTime);
                return  dateB - dateA;
            });
        }

        else if(sortSelection === DATE_OF_BOOKING_ASCENDING){
            allBookingInfo.sort(function(a,b){
                const dateA = getBookingDateForSorting(a);
                const dateB = getBookingDateForSorting(b);
                return  dateA - dateB;
            });
        }
        else if(sortSelection === DATE_OF_BOOKING_DESCENDING){
            allBookingInfo.sort(function(a,b){
                const dateA = getBookingDateForSorting(a);
                const dateB = getBookingDateForSorting(b);
                return  dateB - dateA;
            });
        }

        else if(sortSelection === TITLE_ASCENDING){
            allBookingInfo.sort(function(a,b){
                const titleA = getBookingTitleForSorting(a).toUpperCase();
                const titleB = getBookingTitleForSorting(b).toUpperCase();
                if(titleA > titleB){
                    return 1;
                }
                if(titleA < titleB){
                    return -1;
                }
                return  0;
            });
        }
        else if(sortSelection === TITLE_DESCENDING){
            allBookingInfo.sort(function(a,b){
                const titleA = getBookingTitleForSorting(a).toUpperCase();
                const titleB = getBookingTitleForSorting(b).toUpperCase();
                if(titleA > titleB){
                    return -1;
                }
                if(titleA < titleB){
                    return 1;
                }
                return  0;
            });
        }

        else if(sortSelection === TOTAL_PRICE_ASCENDING){
            allBookingInfo.sort(function(a,b){
                const totalPriceA = getTotalPriceForSorting(a);
                const totalPriceB = getTotalPriceForSorting(b);
                if(totalPriceA > totalPriceB){
                    return 1;
                }
                if(totalPriceA < totalPriceB){
                    return -1;
                }
                return  0;
            });
        }
        else if(sortSelection === TOTAL_PRICE_DESCENDING){
            allBookingInfo.sort(function(a,b){
                const totalPriceA = getTotalPriceForSorting(a);
                const totalPriceB = getTotalPriceForSorting(b);
                if(totalPriceA > totalPriceB){
                    return -1;
                }
                if(totalPriceA < totalPriceB){
                    return 1;
                }
                return  0;
            });
        }

        else if(sortSelection === NUMBER_OF_GUESTS_ASCENDING){
            allBookingInfo.sort(function(a,b){
                const noOfGuestA = getNumberOfGuestsForSorting(a);
                const noOfGuestB = getNumberOfGuestsForSorting(b);
                if(noOfGuestA > noOfGuestB){
                    return 1;
                }
                if(noOfGuestA < noOfGuestB){
                    return -1;
                }
                return  0;
            });
        }
        else if(sortSelection === NUMBER_OF_GUESTS_DESCENDING){
            allBookingInfo.sort(function(a,b){
                const noOfGuestA = getNumberOfGuestsForSorting(a);
                const noOfGuestB = getNumberOfGuestsForSorting(b);
                if(noOfGuestA > noOfGuestB){
                    return -1;
                }
                if(noOfGuestA < noOfGuestB){
                    return 1;
                }
                return  0;
            });
        }

    }


    function getBookingDateForSorting(bookingInformation){
        const { bookingInfo } = bookingInformation;
        if(Object.hasOwn(bookingInfo, 'bookingRoomTitle')){
            if (bookingInfo.bookingCheckoutDate) {
                return new Date(bookingInfo.bookingCheckoutDate);
            }          
        }
        else if(Object.hasOwn(bookingInfo, 'diningRestaurantTitle')){
            if (bookingInfo.tableBookingDate) {
                return new Date(bookingInfo.tableBookingDate);
            }
        }
        else if(Object.hasOwn(bookingInfo, 'meetingEventsInfoTitle')){
            if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE) {
                return new Date(bookingInfo.meetingEventBookingDate);
            }
            else if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) {
                return new Date(bookingInfo.meetingEventEndBookingDate);
            }       
            else if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) {
                const dates = bookingInfo.allDatesBookingInformation.map(function(dateInfo){ 
                    return new Date(dateInfo.meetingEventBookingDate);
                });
                return new Date(Math.max(...dates)); // Use the highest date
            }
        }
    }


    function getBookingTitleForSorting(bookingInformation){
        const { bookingInfo } = bookingInformation;
        if(Object.hasOwn(bookingInfo, 'bookingRoomTitle')){
            return bookingInfo.bookingRoomTitle;         
        }
        else if(Object.hasOwn(bookingInfo, 'diningRestaurantTitle')){
            return bookingInfo.diningRestaurantTitle; 
        }
        else if(Object.hasOwn(bookingInfo, 'meetingEventsInfoTitle')){
            return bookingInfo.meetingEventsInfoTitle; 
        }
    }


    function getTotalPriceForSorting(bookingInformation){
        const { bookingInfo } = bookingInformation;
        if(Object.hasOwn(bookingInfo, 'bookingRoomTitle')){
            if (bookingInfo.totalPriceOfAllRooms) {
                return bookingInfo.totalPriceOfAllRooms;
            }          
        }
        else if(Object.hasOwn(bookingInfo, 'diningRestaurantTitle')){
            if (bookingInfo.priceForBooking) {
                return bookingInfo.priceForBooking;
            }
        }
        else if(Object.hasOwn(bookingInfo, 'meetingEventsInfoTitle')){
            if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE) {
                return bookingInfo.totalPriceEventMeetingRoom;
            }
            else if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) {
                return bookingInfo.totalPriceEventMeetingRoom;
            }
            else if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) {
                return bookingInfo.totalPriceOfAllDates;
            }
        }
    }


    function getNumberOfGuestsForSorting(bookingInformation){
        const { bookingInfo } = bookingInformation;
        if(Object.hasOwn(bookingInfo, 'bookingRoomTitle')){
            if (bookingInfo.totalGuest) {
                return bookingInfo.totalGuest;
            }          
        }
        else if(Object.hasOwn(bookingInfo, 'diningRestaurantTitle')){
            if (bookingInfo.noOfGuests) {
                return bookingInfo.noOfGuests;
            }
        }
        else if(Object.hasOwn(bookingInfo, 'meetingEventsInfoTitle')){
            if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE) {
                return bookingInfo.maximumGuestAttending;
            }    
            else if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) {
                return bookingInfo.maximumGuestAttending;
            }
            else if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) {
                const guestCounts = bookingInfo.allDatesBookingInformation.map(function(dateInfo){ 
                    return dateInfo.maximumGuestAttending;
                });
                return Math.max(...guestCounts); // Use the highest guest
            }
        }
    }



    return (
        <div>

            <div className={styles.sortingContainer}>
                <h4>Sort By</h4>
                <select onChange={(event) => setSortSelection(event.target.value)}>
                    <option selected>Please Select</option>
                    <option value={DATE_BOOKED_ASCENDING}>Date On Which Booked Ascending</option>
                    <option value={DATE_BOOKED_DESCENDING}>Date On Which Booked Descending</option>
                    <option value={DATE_OF_BOOKING_ASCENDING}>Date of Booking Ascending</option>
                    <option value={DATE_OF_BOOKING_DESCENDING}>Date of Booking Descending</option>
                    <option value={TITLE_ASCENDING}>Title of Room Suites/ Dining/ Meeting Event Room Ascending</option>
                    <option value={TITLE_DESCENDING}>Title of Room Suites/ Dining/ Meeting Event Room Descending</option>
                    <option value={TOTAL_PRICE_ASCENDING}>Total Price Ascending</option>
                    <option value={TOTAL_PRICE_DESCENDING}>Total Price Descending</option>
                    <option value={NUMBER_OF_GUESTS_ASCENDING}>Number of Guests Ascending</option>
                    <option value={NUMBER_OF_GUESTS_DESCENDING}>Number of Guests Descending</option>
                </select>
            </div>

            {allBookingInfo.map(function(eachBookingInfo){
                const bookingInfo =  eachBookingInfo.bookingInfo; 
                const transactionDetails = eachBookingInfo.transactionDetails;
                if(Object.hasOwn(bookingInfo, 'bookingRoomTitle')){
                    return <EachRoomBookingInfo eachRoomBookingInfo={bookingInfo} transactionDetails={transactionDetails} />
                }
                else if(Object.hasOwn(bookingInfo, 'diningRestaurantTitle')){
                    return <EachDiningBookingInfo eachDiningBookingInfo={bookingInfo} transactionDetails={transactionDetails} />
                }
                else if(Object.hasOwn(bookingInfo, 'meetingEventsInfoTitle')){
                    return <EachEventMeetingBookingInfo eachEventMeetingBookingInfo={bookingInfo} transactionDetails={transactionDetails} />
                }
            })}
        </div>
    );
}


export default UserAllBookingComponent;