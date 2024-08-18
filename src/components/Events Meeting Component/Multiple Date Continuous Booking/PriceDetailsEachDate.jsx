'use client'
import React, { useState, useEffect } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

import { getDateText } from "@/functions/date.js";
import EquipmentsPriceBreakup from '@/components/Events Meeting Component/Common Components/EquipmentsPriceBreakup.jsx';
import MealsPriceBreakup from '@/components/Events Meeting Component/Common Components/MealsPriceBreakup.jsx';


function PriceDetailsEachDate(props){

    useEffect(()=>{
        fetchCurrentDateBasicPrice();
        fetchCurrentRoomSeatingArrangementPrice();
        fetchCurrentDayFoodServicePrice();
    }, []);

    const currentDate = props.currentDate;
    const bookingDetailsEachDayInfo = props.bookingDetailsEachDayInfo;
    
    const meetingEventAreaTitle = bookingDetailsEachDayInfo.meetingEventsInfoTitle;
    const meetingEventBookingSlots = bookingDetailsEachDayInfo.meetingEventBookingTime;
    const meetingEventSeatingArrangement = bookingDetailsEachDayInfo.meetingEventSeatingArrangement;
    const maximumGuestAttending = bookingDetailsEachDayInfo.maximumGuestAttending;

    const [basicPriceDetailsInformation, setBasicPriceDetailsInformation] = useState(null);
    const [seatingArrangementPriceInformation, setSeatingArrangementPriceInformation] = useState(null);
    const [foodServicePriceInformation, setFoodServicePriceInformation] = useState(null);
    const [fullDayTotalPriceCurrentDate, setFullDayTotalPriceCurrentDate] = useState(null);

    // console.log(basicPriceDetailsInformation);
    // console.log(seatingArrangementPriceInformation);
    // console.log(foodServicePriceInformation);

    const isMorningSlotSelected = meetingEventBookingSlots.includes('Morning');
    const isAfternoonSlotSelected = meetingEventBookingSlots.includes('Afternoon');
    const isEveningSlotSelected = meetingEventBookingSlots.includes('Evening');
    const isNightSlotSelected = meetingEventBookingSlots.includes('Night');
    const isMidNightSlotSelected = meetingEventBookingSlots.includes('Mid Night');

    let morningSlotBasicPrice = 0;
    let afternoonSlotBasicPrice = 0;
    let eveningSlotBasicPrice = 0;
    let nightSlotBasicPrice = 0;
    let midNightSlotBasicPrice = 0;

    if(basicPriceDetailsInformation != null){
        const bookingDateEventArray = basicPriceDetailsInformation.eventTimingDetails;
        morningSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, 'Morning');
        afternoonSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, 'Afternoon');
        eveningSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, 'Evening');
        nightSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, 'Night');
        midNightSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, 'Mid Night');
    }

    let seatingArrangementPriceList = [];
    if(seatingArrangementPriceInformation != null){
        const priceList = seatingArrangementPriceInformation.priceForEquipments;
        const finalPriceList = priceList;
        const priceOfEachSeat = priceList.priceForEachSeat;
        const totalPriceOfAllSeats = maximumGuestAttending * priceOfEachSeat;
        finalPriceList.totalPriceOfAllSeats = totalPriceOfAllSeats;
        if(Object.hasOwn(priceList, 'priceForEachCircularTable') && Object.hasOwn(priceList, 'noOfGuestInEachCircularTable')){
            const noOfGuestInEachCircularTable = priceList.noOfGuestInEachCircularTable;
            const priceForEachCircularTable = priceList.priceForEachCircularTable;
            const numberOfCircularTableRequired = Math.ceil(maximumGuestAttending/noOfGuestInEachCircularTable);
            const totalPriceOfAllCircularTables = priceForEachCircularTable * numberOfCircularTableRequired;
            finalPriceList.totalPriceOfAllCircularTables = totalPriceOfAllCircularTables;
            finalPriceList.numberOfCircularTableRequired = numberOfCircularTableRequired;
        }
        //console.log(finalPriceList);
        
        const priceListNameArray = Object.keys(finalPriceList);
        const priceListArrayObj = priceListNameArray.map(function(eachName){
            const eachPrice = {};
            let propertyName =  eachName;
            propertyName = propertyName.replace(/([A-Z])/g, ' $1');
            propertyName = propertyName.charAt(0).toUpperCase() + propertyName.substr(1);
            eachPrice.priceNameProperty = propertyName;
            eachPrice.priceOfProperty = finalPriceList[eachName];
            return eachPrice;
        });
        seatingArrangementPriceList = priceListArrayObj;
    }
    //console.log(seatingArrangementPriceList);

    let totalPriceOfRoomAppliance = 0;
    seatingArrangementPriceList.forEach(function(eachPriceList) {
        const commonPriceIncludedForTotal = ['Price For Stage', 'Price For Projector', 'Price For Electrical Appliance', 'Total Price Of All Seats'];
        const specialPriceIncludedForTotal = ['Price For U Shape Table', 'Price Of Boardroom Table', 'Total Price Of All Circular Tables'];
        if(commonPriceIncludedForTotal.includes(eachPriceList.priceNameProperty) || specialPriceIncludedForTotal.includes(eachPriceList.priceNameProperty)){
            totalPriceOfRoomAppliance = totalPriceOfRoomAppliance + eachPriceList.priceOfProperty;
        }
    });

    let morningSlotTotalFoodPrice = 0;
    let afternoonSlotTotalFoodPrice = 0;
    let eveningSlotTotalFoodPrice = 0;
    let nightSlotTotalFoodPrice = 0;
    let midNightSlotTotalFoodPrice = 0;

    let morningSlotTotalFoodPricePerGuest = 0;
    let afternoonSlotTotalFoodPricePerGuest = 0;
    let eveningSlotTotalFoodPricePerGuest = 0;
    let nightSlotTotalFoodPricePerGuest = 0;
    let midNightSlotTotalFoodPricePerGuest = 0;

    let selectedMorningMeals;
    let selectedAfternoonMeals;
    let selectedEveningMeals;
    let selectedNightMeals;
    let selectedMidNightMeals;

    let allMorningMealsInformation = null;
    let allAfternoonMealsInformation = null;
    let allEveningMealsInformation = null;
    let allNightMealsInformation = null;
    let allMidNightMealsInformation = null;

    if(foodServicePriceInformation != null){
        allMorningMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, 'Morning');
        allAfternoonMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, 'Afternoon');
        allEveningMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, 'Evening');
        allNightMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, 'Night');
        allMidNightMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, 'Mid Night');

        if(bookingDetailsEachDayInfo.wantFoodServices == 'Yes' && Object.hasOwn(bookingDetailsEachDayInfo, 'selectedMealsOnBookingDate')){
            const mealsBookingDetails = bookingDetailsEachDayInfo.selectedMealsOnBookingDate;
            if(mealsBookingDetails.morning.length > 0){
                selectedMorningMeals = mealsBookingDetails.morning;
                morningSlotTotalFoodPricePerGuest = getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, 'Morning', selectedMorningMeals);
                morningSlotTotalFoodPrice = morningSlotTotalFoodPricePerGuest * maximumGuestAttending;
            }
            if(mealsBookingDetails.afternoon.length > 0){
                selectedAfternoonMeals = mealsBookingDetails.afternoon;
                afternoonSlotTotalFoodPricePerGuest = getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, 'Afternoon', selectedAfternoonMeals);
                afternoonSlotTotalFoodPrice = afternoonSlotTotalFoodPricePerGuest * maximumGuestAttending;
            }
            if(mealsBookingDetails.evening.length > 0){
                selectedEveningMeals = mealsBookingDetails.evening;
                eveningSlotTotalFoodPricePerGuest = getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, 'Evening', selectedEveningMeals);
                eveningSlotTotalFoodPrice = eveningSlotTotalFoodPricePerGuest * maximumGuestAttending;
            }
            if(mealsBookingDetails.night.length > 0){
                selectedNightMeals = mealsBookingDetails.night;
                nightSlotTotalFoodPricePerGuest = getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, 'Night', selectedNightMeals);
                nightSlotTotalFoodPrice = nightSlotTotalFoodPricePerGuest * maximumGuestAttending;
            }
            if(mealsBookingDetails.midNight.length > 0){
                selectedMidNightMeals = mealsBookingDetails.midNight;
                midNightSlotTotalFoodPricePerGuest = getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, 'Mid Night', selectedMidNightMeals);
                midNightSlotTotalFoodPrice = midNightSlotTotalFoodPricePerGuest * maximumGuestAttending;
            }
        }
    }


    let morningSlotTotalPrice = 0;
    let afternoonSlotTotalPrice = 0;
    let eveningSlotTotalPrice = 0;
    let nightSlotTotalPrice = 0;
    let midNightSlotTotalPrice = 0;
    let fullDayTotalPrice = 0;

    if(basicPriceDetailsInformation != null && seatingArrangementPriceInformation != null && foodServicePriceInformation != null){
        if(isMorningSlotSelected){
            morningSlotTotalPrice = morningSlotBasicPrice + totalPriceOfRoomAppliance + morningSlotTotalFoodPrice;
        }
        if(isAfternoonSlotSelected){
            afternoonSlotTotalPrice = afternoonSlotBasicPrice + totalPriceOfRoomAppliance + afternoonSlotTotalFoodPrice;
        }
        if(isEveningSlotSelected){
            eveningSlotTotalPrice = eveningSlotBasicPrice + totalPriceOfRoomAppliance + eveningSlotTotalFoodPrice;
        }
        if(isNightSlotSelected){
            nightSlotTotalPrice = nightSlotBasicPrice + totalPriceOfRoomAppliance + nightSlotTotalFoodPrice;
        }
        if(isMidNightSlotSelected){
            midNightSlotTotalPrice = midNightSlotBasicPrice + totalPriceOfRoomAppliance + midNightSlotTotalFoodPrice;
        }
    
        fullDayTotalPrice = morningSlotTotalPrice + afternoonSlotTotalPrice + eveningSlotTotalPrice + nightSlotTotalPrice + midNightSlotTotalPrice;
    }

    useEffect(function(){
            if(fullDayTotalPrice > 0){
                const currentDateWithPrice = {
                    currentDate,
                    fullDayTotalPrice
                }
                props.onEachDateTotalPrice(currentDateWithPrice);
            }
    }, [fullDayTotalPrice]);
    
    

    async function fetchCurrentDateBasicPrice() {
        try{
            const response = await fetch('/api/hotel-booking-information/events-meeting-room-information/each-day-information/');
            const data = await response.json();
            const allRoomBasicPriceData = data.meetingEventDetailsWithDate;
            const bookingRoomBasicPriceData = allRoomBasicPriceData.find(function(eachRoom){
                return meetingEventAreaTitle == eachRoom.diningTitle;
            });
            const bookingRoomAllDateBasicPriceData = bookingRoomBasicPriceData.dateDetails;
            const bookingDateBasicPricData = bookingRoomAllDateBasicPriceData.find(function(eachDate){
                const eachDateString = (eachDate.date).split("T")[0];
                return eachDateString == currentDate;
            });
            setBasicPriceDetailsInformation(bookingDateBasicPricData);
        }
        catch(error){
            console.log(error);
        }
    }

    async function fetchCurrentRoomSeatingArrangementPrice(){
        try {
            const response = await fetch('/api/hotel-booking-information/events-meeting-room-information/each-seating-arrangement-price/');
            const data = await response.json();
            const allEventMeetingRoomData = data.eventMeetingPriceForSeatingArrangement;

            const selectedEventMeetingRoomData = allEventMeetingRoomData.find(function(eachRoom){
                return eachRoom.meetingEventAreaTitle == meetingEventAreaTitle;
            });

            const allSeatingArrangementData = selectedEventMeetingRoomData.seatingArrangement;
            const selectedSeatingArrangementData = allSeatingArrangementData.find(function(eachArrangement){
                return meetingEventSeatingArrangement == eachArrangement.meetingEventAreaSeatingTitle;
            });
            setSeatingArrangementPriceInformation(selectedSeatingArrangementData);
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchCurrentDayFoodServicePrice() {
        try {
            const response = await fetch('/api/hotel-booking-information/events-meeting-room-information/each-day-food-price/');
            const data = await response.json();
            const allDateFoodServicePrice = data.meetingEventFoodPriceWithDate;

            const bookingDateFoodServicePrice = allDateFoodServicePrice.find(function(eachDate){
                const eachDateString = (eachDate.date).split("T")[0];
                return eachDateString == currentDate;
            });
            setFoodServicePriceInformation(bookingDateFoodServicePrice);
        } catch (error) {
            console.log(error);
        }
    }

    function getBasicPriceOfRoomForSlot(dateEvent, timeSlot){
        const getDateEventSlotDetails = dateEvent.find(function(eachSlot){
            return eachSlot.currentMeetingEventTiming == timeSlot
        });
        const basicPriceOfSlot = getDateEventSlotDetails.currentMeetingEventTimingBasicPrice;
        return basicPriceOfSlot;
    }

    function getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, selectedFoodServiceSlot, selectedMeals){
        let currentFoodTotalPricePerGuest = 0;
        const currentTimeFoodDetails = foodServicePriceInformation.eventTimingDetails.find(function(eachFoodTime){
            return eachFoodTime.meetingEventCurrentTiming == selectedFoodServiceSlot;
        });
        const currentTimeFoodPriceDetails = currentTimeFoodDetails.meetingEventCurrentTimingFoodPrice;
        currentTimeFoodPriceDetails.forEach(function(eachFoodItem){
            const foodItemName = eachFoodItem.foodTitle;
            const foodItemPrice = eachFoodItem.pricePerGuest;
            selectedMeals.forEach(function(selectedEachFoodItem){
                if(foodItemName == selectedEachFoodItem){
                    currentFoodTotalPricePerGuest = currentFoodTotalPricePerGuest + foodItemPrice;
                }
            })
        });
        return currentFoodTotalPricePerGuest;
    }

    function getSpecificMealAllFoodService(foodServicePriceInformation, mealName){
        const currentTimeFoodDetails = foodServicePriceInformation.eventTimingDetails.find(function(eachFoodTime){
            return eachFoodTime.meetingEventCurrentTiming == mealName;
        });
        return currentTimeFoodDetails;
    }


    return (
        <TableBody>
            {(isMorningSlotSelected) &&
            <TableRow>
                <TableCell>{getDateText(new Date(currentDate))}</TableCell>
                <TableCell>Morning</TableCell>
                <TableCell align="right">{morningSlotBasicPrice}</TableCell>
                <TableCell align="right">
                    {totalPriceOfRoomAppliance}
                    <EquipmentsPriceBreakup 
                        maximumGuestAttending={maximumGuestAttending} 
                        seatingArrangementPriceList={seatingArrangementPriceList} 
                    />
                </TableCell>
                <TableCell align="right">
                    {morningSlotTotalFoodPrice} 
                    {(morningSlotTotalFoodPrice > 0) &&
                    <MealsPriceBreakup 
                        selectedMeals={selectedMorningMeals} 
                        maximumGuestAttending={maximumGuestAttending} 
                        allMealsList={allMorningMealsInformation} 
                    />
                    }
                </TableCell>
                <TableCell align="right">{morningSlotTotalPrice}</TableCell>
            </TableRow>
            }

            {(isAfternoonSlotSelected) &&
            <TableRow>
                <TableCell>{getDateText(new Date(currentDate))}</TableCell>
                <TableCell>Afternoon</TableCell>
                <TableCell align="right">{afternoonSlotBasicPrice}</TableCell>
                <TableCell align="right">
                    {totalPriceOfRoomAppliance}
                    <EquipmentsPriceBreakup 
                        maximumGuestAttending={maximumGuestAttending} 
                        seatingArrangementPriceList={seatingArrangementPriceList} 
                    />
                </TableCell>
                <TableCell align="right">
                    {afternoonSlotTotalFoodPrice} 
                    {(afternoonSlotTotalFoodPrice > 0) &&
                    <MealsPriceBreakup 
                        selectedMeals={selectedAfternoonMeals} 
                        maximumGuestAttending={maximumGuestAttending} 
                        allMealsList={allAfternoonMealsInformation} 
                    />
                    }
                </TableCell>
                <TableCell align="right">{afternoonSlotTotalPrice}</TableCell>
            </TableRow>
            }

            {(isEveningSlotSelected) &&
            <TableRow>
                <TableCell>{getDateText(new Date(currentDate))}</TableCell>
                <TableCell>Evening</TableCell>
                <TableCell align="right">{eveningSlotBasicPrice}</TableCell>
                <TableCell align="right">
                    {totalPriceOfRoomAppliance}
                    <EquipmentsPriceBreakup 
                        maximumGuestAttending={maximumGuestAttending} 
                        seatingArrangementPriceList={seatingArrangementPriceList} 
                    />
                </TableCell>
                <TableCell align="right">
                    {eveningSlotTotalFoodPrice} 
                    {(eveningSlotTotalFoodPrice > 0) &&
                    <MealsPriceBreakup 
                        selectedMeals={selectedEveningMeals} 
                        maximumGuestAttending={maximumGuestAttending} 
                        allMealsList={allEveningMealsInformation} 
                    />
                    }
                </TableCell>
                <TableCell align="right">{eveningSlotTotalPrice}</TableCell>
            </TableRow>
            }

            {(isNightSlotSelected) &&
            <TableRow>
                <TableCell>{getDateText(new Date(currentDate))}</TableCell>
                <TableCell>Night</TableCell>
                <TableCell align="right">{nightSlotBasicPrice}</TableCell>
                <TableCell align="right">
                    {totalPriceOfRoomAppliance}
                    <EquipmentsPriceBreakup 
                        maximumGuestAttending={maximumGuestAttending} 
                        seatingArrangementPriceList={seatingArrangementPriceList} 
                    />
                </TableCell>
                <TableCell align="right">
                    {nightSlotTotalFoodPrice} 
                    {(nightSlotTotalFoodPrice > 0) &&
                    <MealsPriceBreakup 
                        selectedMeals={selectedNightMeals} 
                        maximumGuestAttending={maximumGuestAttending} 
                        allMealsList={allNightMealsInformation} 
                    />
                    }
                </TableCell>
                <TableCell align="right">{nightSlotTotalPrice}</TableCell>
            </TableRow>
            }

            {(isMidNightSlotSelected) &&
            <TableRow>
                <TableCell>{getDateText(new Date(currentDate))}</TableCell>
                <TableCell>Mid Night</TableCell>
                <TableCell align="right">{midNightSlotBasicPrice}</TableCell>
                <TableCell align="right">
                    {totalPriceOfRoomAppliance}
                    <EquipmentsPriceBreakup 
                        maximumGuestAttending={maximumGuestAttending} 
                        seatingArrangementPriceList={seatingArrangementPriceList} 
                    />
                </TableCell>
                <TableCell align="right">
                    {midNightSlotTotalFoodPrice} 
                    {(midNightSlotTotalFoodPrice > 0) &&
                    <MealsPriceBreakup 
                        selectedMeals={selectedMidNightMeals} 
                        maximumGuestAttending={maximumGuestAttending} 
                        allMealsList={allMidNightMealsInformation} 
                    />
                    }
                </TableCell>
                <TableCell align="right">{midNightSlotTotalPrice}</TableCell>
            </TableRow>
            }
        </TableBody>
    );
}

export default PriceDetailsEachDate;