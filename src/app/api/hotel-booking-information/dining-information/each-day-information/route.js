import { NextRequest, NextResponse } from "next/server";

import diningBookingPrice from "@/json objects/booking rates/diningBookingPrice.js";
import { noOfDaysBookingPriceAvailableAfterToday } from "@/json objects/booking rates/diningBookingPrice.js";
import { getOnlyDay } from "@/functions/date.js";


function GET(){

    const diningWithDate = diningBookingPrice.map(function(eachDiningRestaurant){
        const currentDiningRestaurantDetailsObject = {};
        const diningTitle = eachDiningRestaurant.diningAreaTitle;
        const totalTablesCurrentRestaurant = eachDiningRestaurant.totalTables;
        const currentRestaurantDayList = eachDiningRestaurant.dayList;
        const dateDetailsForCurrentRestaurant = getDateDetailsForCurrentDiningRestaurant(currentRestaurantDayList, totalTablesCurrentRestaurant);

        currentDiningRestaurantDetailsObject.diningTitle = diningTitle;
        currentDiningRestaurantDetailsObject.dateDetails = dateDetailsForCurrentRestaurant;        

        return currentDiningRestaurantDetailsObject;
    });
    
    return NextResponse.json(
        {diningWithDate}
    );
    
}


function getDateDetailsForCurrentDiningRestaurant(currentRestaurantDayList, totalTables){
    const dateDetails = [];
    const todayDate = new Date().toISOString().split("T")[0];
    let currentDate = new Date(todayDate);
    const dateToday = new Date(currentDate);
    const dayOfWeekToday = getOnlyDay(dateToday);
    const foodCategoryDetailsToday = currentRestaurantDayList.find(function(eachDayList){
        return dayOfWeekToday == eachDayList.day;
    });
    const todayFoodCategoryArray = foodCategoryDetailsToday.foodCategoryList;
    const todayFoodListArray = todayFoodCategoryArray.map(function(eachFoodCategory){
        const currentFoodCategory = eachFoodCategory.foodCategory;
        const currentFoodCategoryPriceList = eachFoodCategory.priceList
        const currentFoodCategoryObject = {
            currentFoodCategory,
            currentFoodCategoryPriceList,
            totalTables
        }
        return currentFoodCategoryObject;
    });
    const todayDateDetails = {
        date: dateToday,
        foodCategoryDetails: todayFoodListArray
    };
    dateDetails.push(todayDateDetails);

    for(let i = 0 ; i < noOfDaysBookingPriceAvailableAfterToday ; i++){
        //Increment the date by 1 day
        currentDate.setDate(currentDate.getDate() + 1);
        const dateAfterToday = new Date(currentDate);
        const dayOfWeekAfterToday = getOnlyDay(dateAfterToday);
        const foodCategoryDetailsAfterToday = currentRestaurantDayList.find(function(eachDayList){
            return dayOfWeekAfterToday == eachDayList.day;
        });
        const currentDayFoodCategoryArrayAfterToday = foodCategoryDetailsAfterToday.foodCategoryList;
        const currentDayFoodListArrayAfterToday = currentDayFoodCategoryArrayAfterToday.map(function(eachFoodCategory){
            const currentFoodCategory = eachFoodCategory.foodCategory;
            const currentFoodCategoryPriceList = eachFoodCategory.priceList
            const currentFoodCategoryObject = {
                currentFoodCategory,
                currentFoodCategoryPriceList,
                totalTables
            }
            return currentFoodCategoryObject;
        });
        const currentdaydateDetailsAfterToday = {
            date: dateAfterToday,
            foodCategoryDetails: currentDayFoodListArrayAfterToday
        };
        dateDetails.push(currentdaydateDetailsAfterToday);
    }

    return dateDetails;
}

export { GET };