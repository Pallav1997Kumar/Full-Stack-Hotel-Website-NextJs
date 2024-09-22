import React from 'react';
import Image from 'next/image';
import Link from 'next/link'
import Button from '@mui/material/Button';

import styles from "./DiningComponent.module.css";

import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


export default async function DiningComponent(props) {

    const currentDining = props.currentDining;
    const diningTitle = currentDining.diningAreaTitle;
    const diningPath = currentDining.diningPath;

    const diningWithDateInformation = await fetchDiningEachDayData(diningTitle);
    const dateDetailsOfDining = diningWithDateInformation.dateDetails;
    const startingPriceOfDining = getDiningStartingPrice(dateDetailsOfDining);

    function getDiningStartingPrice(dateDetailsOfParticularDining){
        let minimumPrice = Infinity;
        dateDetailsOfParticularDining.forEach(function(eachDateDetails){
            const eachDateFoodCategoryArr = eachDateDetails.foodCategoryDetails;
            eachDateFoodCategoryArr.forEach(function(eachFoodCategory){
                const currentPriceList = eachFoodCategory.currentFoodCategoryPriceList;
                const currentPriceListArray = Object.values(currentPriceList);
                currentPriceListArray.forEach(function(eachPrice){
                    if(eachPrice < minimumPrice){
                        minimumPrice = eachPrice;
                    }
                })
            })
        });
        return minimumPrice;
    }

    
    return (
        <div className={styles.eachCurrentDining}>
            <div className={styles.currentDiningImage}>
                <Image src={currentDining.photo} alt="current-dining" width={500} height={300} />
            </div>
            <div className={styles.currentDiningInfo}>
                <h3>{currentDining.diningAreaTitle}</h3>
                <p className={styles.contact}>Contact No: {currentDining.contactNo}</p>
                <p className={styles.shortDesc}>{currentDining.shortDescription}</p>
                <div className={styles.cuisineTime}>
                    <div className={styles.cuisine}>
                        <p>Cuisine: </p>
                        {(currentDining.cuisine).map(function(eachCuisine){
                            return (<li key={eachCuisine}>{eachCuisine}</li>)
                        })}
                    </div>
                    <div className={styles.time}>
                        <p>Timing: </p>
                        {(currentDining.timing).map(function(eachTime){
                            return (<li key={eachTime.foodCategory}>{eachTime.foodCategory} - {eachTime.foodTiming}</li>)
                        })}
                    </div>
                </div>
                <div className={styles.startingPrice}>
                    <p>Booking Price Starts at {CURRENCY_SYMBOL}{startingPriceOfDining}</p>
                </div>
                <div className={styles.buttonConatainer}>
                    <Link href={`/dining/${diningPath}`}>
                        <Button variant="contained">EXPLORE DINING</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
    
}


async function fetchDiningEachDayData(diningTitle){
    try {
        const response = await fetch(`${process.env.URL}/api/hotel-booking-information/dining-information/each-day-information/`);
        const data = await response.json();
        const allDiningWithDate = data.diningWithDate;
        const particularDiningEachDayInfo = allDiningWithDate.find(function(eachDiningWithDate){
            return eachDiningWithDate.diningTitle == diningTitle;
        });
        return particularDiningEachDayInfo;
    } catch (error) {
        console.log(error);
    }
}