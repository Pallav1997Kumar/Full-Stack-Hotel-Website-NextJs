import styles from './EventMeetingMultipleDateNonContinuousBookingInfo.module.css';

import EventMeetingEachDayNonContinuous from './EventMeetingEachDayNonContinuous.jsx';
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


function EventMeetingMultipleDateNonContinuousBookingInfo(props){

    const eachEventMeetingBookingInfo = props.eachEventMeetingBookingInfo;

    return (
        <div className={styles.eachEventMeetingBookingInformation}>
            <p className={styles.eachEventMeetingTitle}>
                Meeting / Event Area Name: {eachEventMeetingBookingInfo.meetingEventsInfoTitle}
            </p>
            {(Object.hasOwn(eachEventMeetingBookingInfo, 'allDatesBookingInformation')) &&
                <div className={styles.allDateNumber}>
                    {(eachEventMeetingBookingInfo.allDatesBookingInformation).map(function(eachBookingDate){
                        return(
                            <EventMeetingEachDayNonContinuous eachBookingDate={eachBookingDate} />
                        )
                   })} 
                </div>
            }
            <p>
                <span className={styles.totalValueTitle}>Total Price All Rooms: </span>
                {CURRENCY_SYMBOL}{eachEventMeetingBookingInfo.totalPriceOfAllDates}
            </p>
            
        </div>
    );
}

export default EventMeetingMultipleDateNonContinuousBookingInfo;