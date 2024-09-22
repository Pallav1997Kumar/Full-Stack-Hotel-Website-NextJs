'use client'
import Button from '@mui/material/Button';

import styles from './EventMeetingMultipleDateNonContinuousCartComponent.module.css';

import EventMeetingEachDayNonContinuous from './EventMeetingEachDayNonContinuous.jsx';
import { useAppDispatch } from "@/redux store/hooks.js";
import { deleteParticularBookingFromEventMeetingCart } from "@/redux store/features/Booking Features/eventMeetingRoomBookingCartSlice.js";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


function EventMeetingMultipleDateNonContinuousCartComponent(props){

    const eachEventMeetingInCart = props.eachEventMeetingInCart;
    const dispatch = useAppDispatch();

    function removeCartHandler(eventCartId){
        dispatch(deleteParticularBookingFromEventMeetingCart(eventCartId));
    }


    return (
        <div className={styles.eachEventMeetingCartInformation}>
            <p className={styles.eachEventMeetingTitle}>
                Meeting / Event Area Name: {eachEventMeetingInCart.meetingEventsInfoTitle}
            </p>
            {(Object.hasOwn(eachEventMeetingInCart, 'allDatesBookingInformation')) &&
                <div className={styles.allDateNumber}>
                    {(eachEventMeetingInCart.allDatesBookingInformation).map(function(eachBookingDate){
                        return(
                            <EventMeetingEachDayNonContinuous eachBookingDate={eachBookingDate} />
                        )
                   })} 
                </div>
            }
            <p>
                <span className={styles.totalValueTitle}>Total Price All Rooms: </span>
                {CURRENCY_SYMBOL}{eachEventMeetingInCart.totalPriceOfAllDates}
            </p>
            <Button onClick={()=>removeCartHandler(eachEventMeetingInCart.eventCartId)} variant="contained">
                Remove From Cart
            </Button>
        </div>
    );
}

export default EventMeetingMultipleDateNonContinuousCartComponent;