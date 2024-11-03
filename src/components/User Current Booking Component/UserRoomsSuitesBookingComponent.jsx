'use client'
import React, { useState } from "react";

import styles from './UserBookingComponent.module.css';

import EachRoomBookingInfo from "@/components/Booking Information Component/Rooms Suites Booking/EachRoomBookingInfo.jsx"
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


function UserRoomsSuitesBookingComponent(props){

    const roomSuitesBookingInfo = props.roomSuitesBookingInfo;

    const [sortSelection, setSortSelection] = useState("");

    if(sortSelection !== ""){

        if(sortSelection === DATE_BOOKED_ASCENDING){
            roomSuitesBookingInfo.sort(function(a,b){
                const dateA = new Date(a.transactionDetails.transactionDateTime);
                const dateB = new Date(b.transactionDetails.transactionDateTime);
                return  dateA - dateB;
            });
        }
        else if(sortSelection === DATE_BOOKED_DESCENDING){
            roomSuitesBookingInfo.sort(function(a,b){
                const dateA = new Date(a.transactionDetails.transactionDateTime);
                const dateB = new Date(b.transactionDetails.transactionDateTime);
                return  dateB - dateA;
            });
        }

        else if(sortSelection === DATE_OF_BOOKING_ASCENDING){
            roomSuitesBookingInfo.sort(function(a,b){
                const dateA = new Date(a.bookingInfo.bookingCheckoutDate);
                const dateB = new Date(b.bookingInfo.bookingCheckoutDate);
                return  dateA - dateB;
            });
        }
        else if(sortSelection === DATE_OF_BOOKING_DESCENDING){
            roomSuitesBookingInfo.sort(function(a,b){
                const dateA = new Date(a.bookingInfo.bookingCheckoutDate);
                const dateB = new Date(b.bookingInfo.bookingCheckoutDate);
                return  dateB - dateA;
            });
        }

        else if(sortSelection === TITLE_ASCENDING){
            roomSuitesBookingInfo.sort(function(a,b){
                const titleA = a.bookingInfo.bookingRoomTitle;
                const titleB = b.bookingInfo.bookingRoomTitle;
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
            roomSuitesBookingInfo.sort(function(a,b){
                const titleA = a.bookingInfo.bookingRoomTitle;;
                const titleB = b.bookingInfo.bookingRoomTitle;
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
            roomSuitesBookingInfo.sort(function(a,b){
                const totalPriceA = a.bookingInfo.totalPriceOfAllRooms;
                const totalPriceB = b.bookingInfo.totalPriceOfAllRooms;
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
            roomSuitesBookingInfo.sort(function(a,b){
                const totalPriceA = a.bookingInfo.totalPriceOfAllRooms;
                const totalPriceB = b.bookingInfo.totalPriceOfAllRooms;
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
            roomSuitesBookingInfo.sort(function(a,b){
                const noOfGuestA = a.bookingInfo.totalGuest;
                const noOfGuestB = b.bookingInfo.totalGuest;
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
            roomSuitesBookingInfo.sort(function(a,b){
                const noOfGuestA = a.bookingInfo.totalGuest;
                const noOfGuestB = b.bookingInfo.totalGuest;
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

            {roomSuitesBookingInfo.map(function(eachRoomBookingInfo){
                const roomBookingInfo =  eachRoomBookingInfo.bookingInfo; 
                const transactionDetails = eachRoomBookingInfo.transactionDetails;
                return <EachRoomBookingInfo eachRoomBookingInfo={roomBookingInfo} transactionDetails={transactionDetails} />
            })}
        </div>
    );

}

export default UserRoomsSuitesBookingComponent;