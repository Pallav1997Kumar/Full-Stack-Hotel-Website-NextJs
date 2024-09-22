import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { getDateText } from "@/functions/date.js";
import { getCommaAndSeperatedArray } from "@/functions/array.js";
import { wantFoodServiceConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


function EventMeetingBookingsDetailsConfirmation(props) {

    const bookingDetailsForCart = props.bookingDetailsForCart;
    const totalPriceEventMeetingRoom = props.totalPriceEventMeetingRoom;

    function getTimeSlotText(timeSlotArray){
        if(timeSlotArray.length === 1){
            return timeSlotArray[0];
        }
        else if(timeSlotArray.length > 1){
            return getCommaAndSeperatedArray(timeSlotArray);
        }
    }

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
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                        {(bookingDetailsForCart.hasOwnProperty('meetingEventBookingDate')) &&
                        <TableRow>
                            <TableCell>Event Room Booking Date</TableCell>
                            <TableCell>{getDateText(bookingDetailsForCart.meetingEventBookingDate)}</TableCell>
                        </TableRow>
                        }
                        {(bookingDetailsForCart.hasOwnProperty('meetingEventStartBookingDate')) &&
                        <TableRow>
                            <TableCell>Event Room Booking Start Date</TableCell>
                            <TableCell>{getDateText(bookingDetailsForCart.meetingEventStartBookingDate)}</TableCell>
                        </TableRow>
                        }
                        {(bookingDetailsForCart.hasOwnProperty('meetingEventEndBookingDate')) &&
                        <TableRow>
                            <TableCell>Event Room Booking End Date</TableCell>
                            <TableCell>{getDateText(bookingDetailsForCart.meetingEventEndBookingDate)}</TableCell>
                        </TableRow>
                        }
                        <TableRow>
                            <TableCell>Time Slot of Booking</TableCell>
                            <TableCell>{getTimeSlotText(bookingDetailsForCart.meetingEventBookingTime)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Seating Arrangement</TableCell>
                            <TableCell>{bookingDetailsForCart.meetingEventSeatingArrangement}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Maximum Number Of Guests Booked</TableCell>
                            <TableCell>{bookingDetailsForCart.maximumGuestAttending}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Want Food Services</TableCell>
                            <TableCell>{bookingDetailsForCart.wantFoodServices}</TableCell>
                        </TableRow>
                        {(bookingDetailsForCart.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && bookingDetailsForCart.selectedMealsOnBookingDate.morning.length > 0) &&
                        <TableRow>
                            <TableCell>Morning Meals</TableCell>
                            <TableCell>{getFoodList(bookingDetailsForCart.selectedMealsOnBookingDate.morning)}</TableCell>
                        </TableRow>
                        }
                        {(bookingDetailsForCart.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && bookingDetailsForCart.selectedMealsOnBookingDate.afternoon.length > 0) &&
                        <TableRow>
                            <TableCell>Afternoon Meals</TableCell>
                            <TableCell>{getFoodList(bookingDetailsForCart.selectedMealsOnBookingDate.afternoon)}</TableCell>
                        </TableRow>
                        }
                        {(bookingDetailsForCart.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && bookingDetailsForCart.selectedMealsOnBookingDate.evening.length > 0) &&
                        <TableRow>
                            <TableCell>Evening Meals</TableCell>
                            <TableCell>{getFoodList(bookingDetailsForCart.selectedMealsOnBookingDate.evening)}</TableCell>
                        </TableRow>
                        }
                        {(bookingDetailsForCart.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && bookingDetailsForCart.selectedMealsOnBookingDate.night.length > 0) &&
                        <TableRow>
                            <TableCell>Night Meals</TableCell>
                            <TableCell>{getFoodList(bookingDetailsForCart.selectedMealsOnBookingDate.night)}</TableCell>
                        </TableRow>
                        }
                        {(bookingDetailsForCart.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && bookingDetailsForCart.selectedMealsOnBookingDate.midNight.length > 0) &&
                        <TableRow>
                            <TableCell>Mid Night Meals</TableCell>
                            <TableCell>{getFoodList(bookingDetailsForCart.selectedMealsOnBookingDate.midNight)}</TableCell>
                        </TableRow>
                        }
                        <TableRow>
                            <TableCell>Total Price Of Room</TableCell>
                            <TableCell>{CURRENCY_SYMBOL}{totalPriceEventMeetingRoom}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default EventMeetingBookingsDetailsConfirmation;