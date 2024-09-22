'use client'
import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { getDatesInRangeInclusiveBothDate, convertDateTextToDate } from '@/functions/date.js';
import PriceDetailsEachDate from './PriceDetailsEachDate.jsx';
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


function PriceDetailsAllDates(props){

    const bookingDetails = props.bookingDetailsForCart;
    const [eachDateTotalPrice, setEachDateTotalPrice] = useState([]);

    const bookingDetailsEachDayInfo = {};
    bookingDetailsEachDayInfo.meetingEventsInfoTitle = bookingDetails.meetingEventsInfoTitle;
    bookingDetailsEachDayInfo.meetingEventBookingTime = bookingDetails.meetingEventBookingTime;
    bookingDetailsEachDayInfo.meetingEventSeatingArrangement = bookingDetails.meetingEventSeatingArrangement;
    bookingDetailsEachDayInfo.maximumGuestAttending = bookingDetails.maximumGuestAttending;
    bookingDetailsEachDayInfo.wantFoodServices = bookingDetails.wantFoodServices;
    if(Object.hasOwn(bookingDetails, 'selectedMealsOnBookingDate')){
        bookingDetailsEachDayInfo.selectedMealsOnBookingDate = bookingDetails.selectedMealsOnBookingDate;
    }

    const eventMeetingRoomBookingStartDateString = convertDateTextToDate(bookingDetails.meetingEventStartBookingDate).toString();
    const eventMeetingRoomBookingEndDateString = convertDateTextToDate(bookingDetails.meetingEventEndBookingDate).toString();
    const eventMeetingRoomBookingStartDate = new Date(eventMeetingRoomBookingStartDateString);
    const eventMeetingRoomBookingEndDate = new Date(eventMeetingRoomBookingEndDateString);
    const eventMeetingBookingDatesArrayList = getDatesInRangeInclusiveBothDate(eventMeetingRoomBookingStartDate, eventMeetingRoomBookingEndDate);
    const eventMeetingBookingDatesStringArrayList = eventMeetingBookingDatesArrayList.map(function(eachDate){
        return convertDateTextToDate(eachDate).toString();
    });
    //console.log(eventMeetingBookingDatesStringArrayList);

    function getEachDateTotalPrice(dateWithPrice){
        setEachDateTotalPrice(function(previousState){
            let updatedEachDateTotalPrice;
            const isSameDateInPreviousDate = previousState.filter(function(eachDate){
                return eachDate.currentDate === dateWithPrice.currentDate
            });
            if(isSameDateInPreviousDate.length === 0){
                updatedEachDateTotalPrice = [...previousState, dateWithPrice];
            }
            else if(isSameDateInPreviousDate.length > 0){
                updatedEachDateTotalPrice = previousState;
            }
            return updatedEachDateTotalPrice;
        });
    }

    let totalPriceForAllDay = 0;
    if(eachDateTotalPrice.length > 0){
        eachDateTotalPrice.forEach(function(eachDate){
            totalPriceForAllDay = totalPriceForAllDay + eachDate.fullDayTotalPrice;
        });
    }
    props.setTotalPriceOfRoom(totalPriceForAllDay);

    
    const tableHeadingStyling = {
        fontWeight: 'bold',
        fontSize: '1.03rem',
        backgroundColor: '#92645B'
    }

    const totalStyling = {
        fontWeight: 'bold'
    }

    
    return (
        <div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={tableHeadingStyling}>Date</TableCell>
                            <TableCell sx={tableHeadingStyling}>Time Slot</TableCell>
                            <TableCell sx={tableHeadingStyling} align="right">Room Basic Price</TableCell>
                            <TableCell sx={tableHeadingStyling} align="right">Equipments Total Price</TableCell>
                            <TableCell sx={tableHeadingStyling} align="right">Food Service Total Price</TableCell>
                            <TableCell sx={tableHeadingStyling} align="right">Total Price</TableCell>
                        </TableRow>
                    </TableHead>
                    {eventMeetingBookingDatesStringArrayList.map(function(eachDate){
                        return (
                            <PriceDetailsEachDate 
                                currentDate={eachDate} 
                                bookingDetailsEachDayInfo={bookingDetailsEachDayInfo}
                                onEachDateTotalPrice={getEachDateTotalPrice}
                            />
                        )
                    })}
                    <TableBody>
                        <TableRow>
                            <TableCell sx={totalStyling}>Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell sx={totalStyling} align="right">{CURRENCY_SYMBOL}{totalPriceForAllDay}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default PriceDetailsAllDates;