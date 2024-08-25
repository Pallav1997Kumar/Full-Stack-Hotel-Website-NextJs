import styles from './UserEventMeetingFoodServices.module.css';

import { getCommaAndSeperatedArray } from "@/functions/array.js";

function UserEventMeetingFoodServices(props){
    const eachEventMeetingInCart = props.eachEventMeetingInCart;

    const meetingEventBookingTime = eachEventMeetingInCart.meetingEventBookingTime;
    const isMorningSlotBooked = meetingEventBookingTime.includes('Morning');
    const isAfternoonSlotBooked = meetingEventBookingTime.includes('Afternoon');
    const isEveningSlotBooked = meetingEventBookingTime.includes('Evening');
    const isNightSlotBooked = meetingEventBookingTime.includes('Night');
    const isMidNightSlotBooked = meetingEventBookingTime.includes('Mid Night');

    const morningFoodItems = eachEventMeetingInCart.selectedMealsOnBookingDate.morning;
    const afternoonFoodItems = eachEventMeetingInCart.selectedMealsOnBookingDate.afternoon;
    const eveningFoodItems = eachEventMeetingInCart.selectedMealsOnBookingDate.evening;
    const nightFoodItems = eachEventMeetingInCart.selectedMealsOnBookingDate.night;
    const midNightFoodItems = eachEventMeetingInCart.selectedMealsOnBookingDate.midNight;

    function getFoodList(foodArrayList){
        const foodArray = foodArrayList.map(function(eachItem){
            return eachItem.split(" (")[0];
        })
        if(foodArray.length == 1){
            return foodArray[0];
        }
        else if(foodArray.length > 1){
            return getCommaAndSeperatedArray(foodArray);
        }
    }

    return (
        <div>
            {isMorningSlotBooked &&
                <div className={styles.eachSlot}>
                    <span className={styles.eachSlotTitle}>Morning Food Items: </span>
                    {(morningFoodItems.length == 0) && <span>N/A</span>}
                    {(morningFoodItems.length > 0) && getFoodList(morningFoodItems)}
                </div>
            }
            {isAfternoonSlotBooked &&
                <div className={styles.eachSlot}>
                    <span className={styles.eachSlotTitle}>Afternoon Food Items: </span>
                    {(afternoonFoodItems.length == 0) && <span>N/A</span>}
                    {(afternoonFoodItems.length > 0) && getFoodList(afternoonFoodItems)}
                </div>
            }
            {isEveningSlotBooked &&
                <div className={styles.eachSlot}>
                    <span className={styles.eachSlotTitle}>Evening Food Items: </span>
                    {(eveningFoodItems.length == 0) && <span>N/A</span>}
                    {(eveningFoodItems.length > 0) && getFoodList(eveningFoodItems)}
                </div>
            }
            {isNightSlotBooked &&
                <div className={styles.eachSlot}>
                    <span className={styles.eachSlotTitle}>Night Food Items: </span>
                    {(nightFoodItems.length == 0) && <span>N/A</span>}
                    {(nightFoodItems.length > 0) && getFoodList(nightFoodItems)}
                </div>
            }
            {isMidNightSlotBooked &&
                <div className={styles.eachSlot}>
                    <span className={styles.eachSlotTitle}>Mid Night Food Items: </span>
                    {(midNightFoodItems.length == 0) && <span>N/A</span>}
                    {(midNightFoodItems.length > 0) && getFoodList(midNightFoodItems)}
                </div>
            } 
        </div>
    );
}

export default UserEventMeetingFoodServices;