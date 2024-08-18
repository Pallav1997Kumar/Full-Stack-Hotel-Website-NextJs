'use client'
import React, { useState } from 'react';

import styles from "./EventsMeetingBookingComponent.module.css";
import SingleDateBookingComponent from "./Single Room Booking/SingleDateBookingComponent.jsx";
import MultipleDateContinuousBookingComponent from "./Multiple Date Continuous Booking/MultipleDateContinuousBookingComponent.jsx";
import MultipleDateNonContinuousBookingComponent from "./Multiple Date Noncontinuous Booking/MultipleDateNonContinuousBookingComponent.jsx";


function EventsMeetingBookingComponent(props) {
    const meetingEventsInfoTitle = props.meetingEventsInfoTitle;
    const meetingEventsSeatingInfo = props.meetingEventsSeatingInfo;

    const [roomBookingDateType, setRoomBookingDateType] = useState("");

    function roomBookingDateTypeChangeHandler(event) {
        setRoomBookingDateType(event.target.value);
    }

    return(
        <div className={styles.meetingEventBookContainer}>
            <h3 className={styles.heading}>Book the Event and Meeting Room</h3>
            <form>
                <p className={styles.labelHead}>Please Select in which category of Date you want to Book the Event and Meeting Room</p>
                <input 
                    id="single-date" 
                    type="radio" 
                    className={styles.eachLabel}
                    name="booking-date-type"
                    value="Single Date"
                    checked={roomBookingDateType === "Single Date"}
                    onChange={roomBookingDateTypeChangeHandler}
                />
                <label htmlFor="single-date">Single Date  [eg. 12 Feb 2024]</label>
                <br />
                <input 
                    id="multiple-date-non-continuous" 
                    type="radio" 
                    className={styles.eachLabel}
                    name="booking-date-type"
                    value="Multiple Dates Non Continuous"
                    checked={roomBookingDateType === "Multiple Dates Non Continuous"}
                    onChange={roomBookingDateTypeChangeHandler}
                />
                <label htmlFor="multiple-date-non-continuous">Multiple Dates (Non Continuous)   [eg. 12 Feb 2024, 15 Feb 2024, 18 Feb 2024]</label>
                <br />
                <input 
                    id="multiple-date-continuous" 
                    type="radio" 
                    className={styles.eachLabel}
                    name="booking-date-type"
                    value="Multiple Dates Continuous"
                    checked={roomBookingDateType === "Multiple Dates Continuous"}
                    onChange={roomBookingDateTypeChangeHandler}
                />
                <label htmlFor="multiple-date-continuous">Multiple Dates (Continuous Date)  [eg. 12 Feb 2024 - 18 Feb 2024]</label>
            </form>
            <div>
                {(roomBookingDateType === 'Single Date') &&
                    <SingleDateBookingComponent 
                        meetingEventsInfoTitle={meetingEventsInfoTitle} 
                        meetingEventsSeatingInfo={meetingEventsSeatingInfo} 
                        roomBookingDateType={roomBookingDateType}
                    />
                }
                {(roomBookingDateType === 'Multiple Dates Continuous') &&
                    <MultipleDateContinuousBookingComponent 
                        meetingEventsInfoTitle={meetingEventsInfoTitle} 
                        meetingEventsSeatingInfo={meetingEventsSeatingInfo}
                        roomBookingDateType={roomBookingDateType} 
                    />
                }
                {(roomBookingDateType === 'Multiple Dates Non Continuous') &&
                    <MultipleDateNonContinuousBookingComponent 
                        meetingEventsInfoTitle={meetingEventsInfoTitle} 
                        meetingEventsSeatingInfo={meetingEventsSeatingInfo} 
                        roomBookingDateType={roomBookingDateType}
                    />
                }
            </div>
        </div>
    );
}

export default EventsMeetingBookingComponent;