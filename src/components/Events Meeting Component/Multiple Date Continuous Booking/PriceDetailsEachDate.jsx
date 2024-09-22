'use client'
import React, { useState, useEffect } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

import { getDateText } from "@/functions/date.js";
import EquipmentsPriceBreakup from '@/components/Events Meeting Component/Common Components/EquipmentsPriceBreakup.jsx';
import MealsPriceBreakup from '@/components/Events Meeting Component/Common Components/MealsPriceBreakup.jsx';
import { useAppSelector } from "@/redux store/hooks.js";
import { wantFoodServiceConstants, eventMeetingTimingConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


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

    const isMorningSlotSelected = meetingEventBookingSlots.includes(eventMeetingTimingConstants.MORNING_TIME);
    const isAfternoonSlotSelected = meetingEventBookingSlots.includes(eventMeetingTimingConstants.AFTERNOON_TIME);
    const isEveningSlotSelected = meetingEventBookingSlots.includes(eventMeetingTimingConstants.EVENING_TIME);
    const isNightSlotSelected = meetingEventBookingSlots.includes(eventMeetingTimingConstants.NIGHT_TIME);
    const isMidNightSlotSelected = meetingEventBookingSlots.includes(eventMeetingTimingConstants.MID_NIGHT_TIME);

    const bookingDateEventArray = basicPriceDetailsInformation.eventTimingDetails;
    const morningSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, eventMeetingTimingConstants.MORNING_TIME);
    const afternoonSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, eventMeetingTimingConstants.AFTERNOON_TIME);
    const eveningSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, eventMeetingTimingConstants.EVENING_TIME);
    const nightSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, eventMeetingTimingConstants.NIGHT_TIME);
    const midNightSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, eventMeetingTimingConstants.MID_NIGHT_TIME);


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
    
    const allMorningMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, eventMeetingTimingConstants.MORNING_TIME);
    const allAfternoonMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, eventMeetingTimingConstants.AFTERNOON_TIME);
    const allEveningMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, eventMeetingTimingConstants.EVENING_TIME);
    const allNightMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, eventMeetingTimingConstants.NIGHT_TIME);
    const allMidNightMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, eventMeetingTimingConstants.MID_NIGHT_TIME);

    if(bookingDetailsEachDayInfo.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && Object.hasOwn(bookingDetailsEachDayInfo, 'selectedMealsOnBookingDate')){
        const mealsBookingDetails = bookingDetailsEachDayInfo.selectedMealsOnBookingDate;
        if(mealsBookingDetails.morning.length > 0){
            selectedMorningMeals = mealsBookingDetails.morning;
            morningSlotTotalFoodPricePerGuest = getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, eventMeetingTimingConstants.MORNING_TIME, selectedMorningMeals);
            morningSlotTotalFoodPrice = morningSlotTotalFoodPricePerGuest * maximumGuestAttending;
        }
        if(mealsBookingDetails.afternoon.length > 0){
            selectedAfternoonMeals = mealsBookingDetails.afternoon;
            afternoonSlotTotalFoodPricePerGuest = getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, eventMeetingTimingConstants.AFTERNOON_TIME, selectedAfternoonMeals);
            afternoonSlotTotalFoodPrice = afternoonSlotTotalFoodPricePerGuest * maximumGuestAttending;
        }
        if(mealsBookingDetails.evening.length > 0){
            selectedEveningMeals = mealsBookingDetails.evening;
            eveningSlotTotalFoodPricePerGuest = getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, eventMeetingTimingConstants.EVENING_TIME, selectedEveningMeals);
            eveningSlotTotalFoodPrice = eveningSlotTotalFoodPricePerGuest * maximumGuestAttending;
        }
        if(mealsBookingDetails.night.length > 0){
            selectedNightMeals = mealsBookingDetails.night;
            nightSlotTotalFoodPricePerGuest = getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, eventMeetingTimingConstants.NIGHT_TIME, selectedNightMeals);
            nightSlotTotalFoodPrice = nightSlotTotalFoodPricePerGuest * maximumGuestAttending;
        }
        if(mealsBookingDetails.midNight.length > 0){
            selectedMidNightMeals = mealsBookingDetails.midNight;
            midNightSlotTotalFoodPricePerGuest = getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, eventMeetingTimingConstants.MID_NIGHT_TIME, selectedMidNightMeals);
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
                <TableCell align="right">{CURRENCY_SYMBOL}{morningSlotBasicPrice}</TableCell>
                <TableCell align="right">
                    {CURRENCY_SYMBOL}{totalPriceOfRoomAppliance}
                    <EquipmentsPriceBreakup 
                        maximumGuestAttending={maximumGuestAttending} 
                        seatingArrangementPriceList={seatingArrangementPriceList} 
                    />
                </TableCell>
                <TableCell align="right">
                    {CURRENCY_SYMBOL}{morningSlotTotalFoodPrice} 
                    {(morningSlotTotalFoodPrice > 0) &&
                    <MealsPriceBreakup 
                        selectedMeals={selectedMorningMeals} 
                        maximumGuestAttending={maximumGuestAttending} 
                        allMealsList={allMorningMealsInformation} 
                    />
                    }
                </TableCell>
                <TableCell align="right">{CURRENCY_SYMBOL}{morningSlotTotalPrice}</TableCell>
            </TableRow>
            }

            {(isAfternoonSlotSelected) &&
            <TableRow>
                <TableCell>{getDateText(new Date(currentDate))}</TableCell>
                <TableCell>Afternoon</TableCell>
                <TableCell align="right">{CURRENCY_SYMBOL}{afternoonSlotBasicPrice}</TableCell>
                <TableCell align="right">
                    {CURRENCY_SYMBOL}{totalPriceOfRoomAppliance}
                    <EquipmentsPriceBreakup 
                        maximumGuestAttending={maximumGuestAttending} 
                        seatingArrangementPriceList={seatingArrangementPriceList} 
                    />
                </TableCell>
                <TableCell align="right">
                    {CURRENCY_SYMBOL}{afternoonSlotTotalFoodPrice} 
                    {(afternoonSlotTotalFoodPrice > 0) &&
                    <MealsPriceBreakup 
                        selectedMeals={selectedAfternoonMeals} 
                        maximumGuestAttending={maximumGuestAttending} 
                        allMealsList={allAfternoonMealsInformation} 
                    />
                    }
                </TableCell>
                <TableCell align="right">{CURRENCY_SYMBOL}{afternoonSlotTotalPrice}</TableCell>
            </TableRow>
            }

            {(isEveningSlotSelected) &&
            <TableRow>
                <TableCell>{getDateText(new Date(currentDate))}</TableCell>
                <TableCell>Evening</TableCell>
                <TableCell align="right">{CURRENCY_SYMBOL}{eveningSlotBasicPrice}</TableCell>
                <TableCell align="right">
                    {CURRENCY_SYMBOL}{totalPriceOfRoomAppliance}
                    <EquipmentsPriceBreakup 
                        maximumGuestAttending={maximumGuestAttending} 
                        seatingArrangementPriceList={seatingArrangementPriceList} 
                    />
                </TableCell>
                <TableCell align="right">
                    {CURRENCY_SYMBOL}{eveningSlotTotalFoodPrice} 
                    {(eveningSlotTotalFoodPrice > 0) &&
                    <MealsPriceBreakup 
                        selectedMeals={selectedEveningMeals} 
                        maximumGuestAttending={maximumGuestAttending} 
                        allMealsList={allEveningMealsInformation} 
                    />
                    }
                </TableCell>
                <TableCell align="right">{CURRENCY_SYMBOL}{eveningSlotTotalPrice}</TableCell>
            </TableRow>
            }

            {(isNightSlotSelected) &&
            <TableRow>
                <TableCell>{getDateText(new Date(currentDate))}</TableCell>
                <TableCell>Night</TableCell>
                <TableCell align="right">{CURRENCY_SYMBOL}{nightSlotBasicPrice}</TableCell>
                <TableCell align="right">
                    {CURRENCY_SYMBOL}{totalPriceOfRoomAppliance}
                    <EquipmentsPriceBreakup 
                        maximumGuestAttending={maximumGuestAttending} 
                        seatingArrangementPriceList={seatingArrangementPriceList} 
                    />
                </TableCell>
                <TableCell align="right">
                    {CURRENCY_SYMBOL}{nightSlotTotalFoodPrice} 
                    {(nightSlotTotalFoodPrice > 0) &&
                    <MealsPriceBreakup 
                        selectedMeals={selectedNightMeals} 
                        maximumGuestAttending={maximumGuestAttending} 
                        allMealsList={allNightMealsInformation} 
                    />
                    }
                </TableCell>
                <TableCell align="right">{CURRENCY_SYMBOL}{nightSlotTotalPrice}</TableCell>
            </TableRow>
            }

            {(isMidNightSlotSelected) &&
            <TableRow>
                <TableCell>{getDateText(new Date(currentDate))}</TableCell>
                <TableCell>Mid Night</TableCell>
                <TableCell align="right">{CURRENCY_SYMBOL}{midNightSlotBasicPrice}</TableCell>
                <TableCell align="right">
                    {CURRENCY_SYMBOL}{totalPriceOfRoomAppliance}
                    <EquipmentsPriceBreakup 
                        maximumGuestAttending={maximumGuestAttending} 
                        seatingArrangementPriceList={seatingArrangementPriceList} 
                    />
                </TableCell>
                <TableCell align="right">
                    {CURRENCY_SYMBOL}{midNightSlotTotalFoodPrice} 
                    {(midNightSlotTotalFoodPrice > 0) &&
                    <MealsPriceBreakup 
                        selectedMeals={selectedMidNightMeals} 
                        maximumGuestAttending={maximumGuestAttending} 
                        allMealsList={allMidNightMealsInformation} 
                    />
                    }
                </TableCell>
                <TableCell align="right">{CURRENCY_SYMBOL}{midNightSlotTotalPrice}</TableCell>
            </TableRow>
            }
        </TableBody>
    );
}

export default PriceDetailsEachDate;