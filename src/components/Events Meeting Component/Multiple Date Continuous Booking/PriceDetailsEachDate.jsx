'use client'
import React, { useState, useEffect } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

import { getDateText } from "@/functions/date.js";
import EquipmentsPriceBreakup from '@/components/Events Meeting Component/Common Components/EquipmentsPriceBreakup.jsx';
import MealsPriceBreakup from '@/components/Events Meeting Component/Common Components/MealsPriceBreakup.jsx';
import { useAppSelector } from "@/redux store/hooks.js";


function PriceDetailsEachDate(props){

    const eachDayFoodPrice = useAppSelector((reduxStore) => reduxStore.eventMeetingEachDayFoodPriceSliceName.eachDayFoodPrice);
    const eachDayInfomation = useAppSelector((reduxStore) => reduxStore.eventMeetingEachDayInformationSliceName.eachDayInfomation);
    const eachDaySeatingArrangement = useAppSelector((reduxStore) => reduxStore.eventMeetingEachDaySeatingArrangementSliceName.eachDaySeatingArrangement);

    const currentDate = props.currentDate;
    const bookingDetailsEachDayInfo = props.bookingDetailsEachDayInfo;
    
    const meetingEventAreaTitle = bookingDetailsEachDayInfo.meetingEventsInfoTitle;
    const meetingEventBookingSlots = bookingDetailsEachDayInfo.meetingEventBookingTime;
    const meetingEventSeatingArrangement = bookingDetailsEachDayInfo.meetingEventSeatingArrangement;
    const maximumGuestAttending = bookingDetailsEachDayInfo.maximumGuestAttending;

    const [fullDayTotalPriceCurrentDate, setFullDayTotalPriceCurrentDate] = useState(null);

    const basicPriceDetailsInformation = fetchCurrentDateBasicPrice(eachDayInfomation);
    const seatingArrangementPriceInformation = fetchCurrentRoomSeatingArrangementPrice(eachDaySeatingArrangement);
    const foodServicePriceInformation = fetchCurrentDayFoodServicePrice(eachDayFoodPrice);

    const isMorningSlotSelected = meetingEventBookingSlots.includes('Morning');
    const isAfternoonSlotSelected = meetingEventBookingSlots.includes('Afternoon');
    const isEveningSlotSelected = meetingEventBookingSlots.includes('Evening');
    const isNightSlotSelected = meetingEventBookingSlots.includes('Night');
    const isMidNightSlotSelected = meetingEventBookingSlots.includes('Mid Night');

    const bookingDateEventArray = basicPriceDetailsInformation.eventTimingDetails;
    const morningSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, 'Morning');
    const afternoonSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, 'Afternoon');
    const eveningSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, 'Evening');
    const nightSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, 'Night');
    const midNightSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, 'Mid Night');


    const priceList = seatingArrangementPriceInformation.priceForEquipments;
    const priceOfEachSeat = priceList.priceForEachSeat;
    const totalPriceOfAllSeats = maximumGuestAttending * priceOfEachSeat;
    const finalPriceList = { ...priceList, totalPriceOfAllSeats };
    if(Object.hasOwn(priceList, 'priceForEachCircularTable') && Object.hasOwn(priceList, 'noOfGuestInEachCircularTable')){
        const noOfGuestInEachCircularTable = priceList.noOfGuestInEachCircularTable;
        const priceForEachCircularTable = priceList.priceForEachCircularTable;
        const numberOfCircularTableRequired = Math.ceil(maximumGuestAttending/noOfGuestInEachCircularTable);
        const totalPriceOfAllCircularTables = priceForEachCircularTable * numberOfCircularTableRequired;
        finalPriceList.totalPriceOfAllCircularTables = totalPriceOfAllCircularTables;
        finalPriceList.numberOfCircularTableRequired = numberOfCircularTableRequired;
    }
        
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
    const seatingArrangementPriceList = priceListArrayObj;
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
    
    const allMorningMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, 'Morning');
    const allAfternoonMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, 'Afternoon');
    const allEveningMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, 'Evening');
    const allNightMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, 'Night');
    const allMidNightMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, 'Mid Night');

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
    
    

    function fetchCurrentDateBasicPrice(eachDayInfomation) {
        const allRoomBasicPriceData = eachDayInfomation.meetingEventDetailsWithDate;
        const bookingRoomBasicPriceData = allRoomBasicPriceData.find(function(eachRoom){
            return meetingEventAreaTitle == eachRoom.diningTitle;
        });
        const bookingRoomAllDateBasicPriceData = bookingRoomBasicPriceData.dateDetails;
        const bookingDateBasicPricData = bookingRoomAllDateBasicPriceData.find(function(eachDate){
            const eachDateString = (eachDate.date).split("T")[0];
            return eachDateString == currentDate;
        });
        return bookingDateBasicPricData;
    }

    function fetchCurrentRoomSeatingArrangementPrice(eachDaySeatingArrangement){
        const allEventMeetingRoomData = eachDaySeatingArrangement.eventMeetingPriceForSeatingArrangement;
        const selectedEventMeetingRoomData = allEventMeetingRoomData.find(function(eachRoom){
            return eachRoom.meetingEventAreaTitle == meetingEventAreaTitle;
        });
        const allSeatingArrangementData = selectedEventMeetingRoomData.seatingArrangement;
        const selectedSeatingArrangementData = allSeatingArrangementData.find(function(eachArrangement){
            return meetingEventSeatingArrangement == eachArrangement.meetingEventAreaSeatingTitle;
        });
        return selectedSeatingArrangementData;
    }

    function fetchCurrentDayFoodServicePrice(eachDayFoodPrice) {
        const allDateFoodServicePrice = eachDayFoodPrice.meetingEventFoodPriceWithDate;
        const bookingDateFoodServicePrice = allDateFoodServicePrice.find(function(eachDate){
            const eachDateString = (eachDate.date).split("T")[0];
            return eachDateString == currentDate;
        });
        return bookingDateFoodServicePrice;
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