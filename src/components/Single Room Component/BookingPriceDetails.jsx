'use client'
import {useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import styles from './BookingPriceDetails.module.css';

import { getDatesInRange, getDateTextFromFullDate, convertDateTextToDate } from "@/functions/date.js";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


const tableHeaderRowStyle = { 
    backgroundColor: 'cadetblue' 
}

const tableHeaderCellStyle = {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    color: 'rgb(196, 20, 20)',
}

const tableRowCellStyle = {
    fontSize: '1.05rem',
    borderBottom: '1px dashed blue',
    borderRight: '1px ridge lightblue'
}

const tableRowStyleForTotal = {
    border: '2px double blue'
}

const tableRowCellStyleForTotal ={
    fontSize: '1.07rem',
    fontWeight: 'bold'
}

const tableRowCellStyleForTotalAmount = {
    borderLeft: '1px solid lightblue',
    fontSize: '1.07rem',
    fontWeight: 'bold'
}


function BookingPriceDetails(props) {
    const roomDetailsForCart = props.roomDetailsForCart;

    const checkinDateString = convertDateTextToDate(roomDetailsForCart.checkinDate).toString();
    const checkoutDateString = convertDateTextToDate(roomDetailsForCart.checkoutDate).toString();

    const roomTitle = roomDetailsForCart.roomTitle;
    const checkinDate = new Date(checkinDateString);
    const checkoutDate = new Date(checkoutDateString);
    const noOfRooms = roomDetailsForCart.totalRooms;


    useEffect(()=>{
        fetchRoomsSuitesEachDayData();
    },[]);

    const [roomWithDateInformation, setRoomWithDateInformation] = useState(null);

    async function fetchRoomsSuitesEachDayData(){
        try{
            const response = await fetch('/api/hotel-booking-information/room-and-suites-information/each-day-information/');
            const data = await response.json();
            const allRoomsWithDate = data.roomsWithDate;
            const particularRoomEachDayInfo = allRoomsWithDate.find(function(eachRoomWithDate){
                return eachRoomWithDate.roomTitle == roomTitle
            });
            setRoomWithDateInformation(particularRoomEachDayInfo);
        }
        catch(error){
            console.log(error);
        }
    }

    const datesArrayList = getDatesInRange(checkinDate,checkoutDate);

    const roomsInfoArray = [];
    if(roomWithDateInformation!= null){
        datesArrayList.forEach(function(eachDate){
            const eachDateInArray = eachDate.toISOString();
            const dateDetailsOfRoom = roomWithDateInformation.dateDetails;
            const currentDateRoomInfo = (dateDetailsOfRoom).find(function(eachDateDetails){
                let eachDateInRoom = eachDateDetails.date.toString().split("T")[0].toString();
                eachDateInRoom = new Date(eachDateInRoom);
                eachDateInRoom = eachDateInRoom.toISOString();
                return (eachDateInRoom == eachDateInArray)
            });
            roomsInfoArray.push(currentDateRoomInfo);
        })
    }
    
    let bookingRoomsPriceDetails;
    if(roomsInfoArray.length > 0){
        bookingRoomsPriceDetails = roomsInfoArray.map(function(eachDateInfo){
            const date = eachDateInfo.date;
            const dateInOrdinal = getDateTextFromFullDate(date);
            const priceOnDate = eachDateInfo.price;
            const totalPriceOnDate = priceOnDate * noOfRooms;
            const currentDateInfo = {
                key: date,
                dateInOrdinal,
                priceOnDate,
                noOfRooms,
                totalPriceOnDate
            }
            return currentDateInfo;
        });
    }

    let totalPriceOfRoom = 0;
    if(Array.isArray(bookingRoomsPriceDetails)){
        bookingRoomsPriceDetails.forEach(function(eachDate){
            totalPriceOfRoom = totalPriceOfRoom + eachDate.totalPriceOnDate;
        });
    }

    props.setTotalPriceOfRoom(totalPriceOfRoom);


    

    return (
        <div className={styles.bookingPriceDetailsContainer}>
            {(Array.isArray(bookingRoomsPriceDetails)) &&
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                    <TableHead>
                        <TableRow sx={tableHeaderRowStyle}>
                            <TableCell sx={tableHeaderCellStyle}>Date</TableCell>
                            <TableCell sx={tableHeaderCellStyle}>Price Of Room</TableCell>
                            <TableCell sx={tableHeaderCellStyle}>No Of Rooms</TableCell>
                            <TableCell sx={tableHeaderCellStyle}>Total Price Of Room</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookingRoomsPriceDetails.map(function(eachDate){
                            return (
                                <TableRow key={eachDate.dateInOrdinal}>
                                    <TableCell sx={tableRowCellStyle}>{eachDate.dateInOrdinal}</TableCell>
                                    <TableCell sx={tableRowCellStyle}>{CURRENCY_SYMBOL}{eachDate.priceOnDate}</TableCell>
                                    <TableCell sx={tableRowCellStyle}>{eachDate.noOfRooms}</TableCell>
                                    <TableCell sx={tableRowCellStyle}>{CURRENCY_SYMBOL}{eachDate.totalPriceOnDate}</TableCell>
                                </TableRow>
                            )
                        })}
                        <TableRow sx={tableRowStyleForTotal}>
                            <TableCell sx={tableRowCellStyleForTotal}>Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell sx={tableRowCellStyleForTotalAmount}>{CURRENCY_SYMBOL}{totalPriceOfRoom}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            }
        </div>
    );

}

export default BookingPriceDetails;