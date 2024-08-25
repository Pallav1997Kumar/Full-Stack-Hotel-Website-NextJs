import Button from '@mui/material/Button';

import styles from "./UserEventMeetingMultipleDateNonContinuousCart.module.css";

import UserEventMeetingEachDayNonContinuous from './UserEventMeetingEachDayNonContinuous.jsx';


function UserEventMeetingMultipleDateNonContinuousCart(props){

    const eachEventMeetingInCart = props.eachEventMeetingInCart;


    return (
        <div className={styles.eachEventMeetingCartInformation}>
            <p className={styles.eachEventMeetingTitle}>
                Meeting / Event Area Name: {eachEventMeetingInCart.meetingEventsInfoTitle}
            </p>
            {(Object.hasOwn(eachEventMeetingInCart, 'allDatesBookingInformation')) &&
                <div className={styles.allDateNumber}>
                    {(eachEventMeetingInCart.allDatesBookingInformation).map(function(eachBookingDate){
                        return(
                            <UserEventMeetingEachDayNonContinuous eachBookingDate={eachBookingDate} />
                        )
                   })} 
                </div>
            }
            <p>
                <span className={styles.totalValueTitle}>Total Price All Rooms: </span>
                {eachEventMeetingInCart.totalPriceOfAllDates}
            </p>
            <Button variant="contained">
                Remove From Cart
            </Button>
        </div>
    );

}

export default UserEventMeetingMultipleDateNonContinuousCart;