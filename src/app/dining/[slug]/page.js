import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';

import styles from "./page.module.css";

import DiningBookingComponent from "@/components/Dining Component/DiningBookingComponent.jsx";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


export async function generateMetadata(context){
    const params = context.params
    const slug = params.slug;
    const currentDiningPath = slug;
    const diningRestaurantInfo = await fetchCurrentDiningData(currentDiningPath);
    const diningAreaTitle = diningRestaurantInfo.diningAreaTitle;
    return {
        title: diningAreaTitle,
    }
}


function getCurrentDiningRestaurantInfo(allDining, diningRestaurantPath){
    const diningRestaurantInfo = allDining.find(function(eachDining){
        return (eachDining.diningPath === diningRestaurantPath);
    });
    return diningRestaurantInfo;
}


export async function fetchCurrentDiningData(currentDiningPath) {
    try {
        // Fetching all dining information
        const response = await fetch(`${process.env.URL}/api/hotel-booking-information/dining-information/`);
        const diningInfo = await response.json();
        const allDiningInfo = diningInfo.dining;

        // Find the current dining information based on the path
        const currentDiningInfo = getCurrentDiningRestaurantInfo(allDiningInfo, currentDiningPath);
        return currentDiningInfo;
    } catch (error) {
        console.error('Error fetching room and suite information:', error);
    }
}

export async function fetchDiningEachDayDataAllRestaurant(){
    try {
        const response = await fetch(`${process.env.URL}/api/hotel-booking-information/dining-information/each-day-information/`);
        const data = await response.json();
        const allDiningWithDate = data.diningWithDate;
        return allDiningWithDate;
    } catch (error) {
        console.log(error);
    }
}

function getDiningStartingPriceOfEachTable(dateDetailsOfParticularDining){
    const minPriceList = {};
    let priceListKeysArray;
    dateDetailsOfParticularDining.forEach(function(eachDateDetails){
        const eachDateFoodCategoryArr = eachDateDetails.foodCategoryDetails;;
        eachDateFoodCategoryArr.forEach(function(eachFoodCategory){
            const currentPriceList = eachFoodCategory.currentFoodCategoryPriceList;
            priceListKeysArray = Object.keys(currentPriceList);
        });
    });

    const priceListParticularDining = [];
    dateDetailsOfParticularDining.forEach(function(eachDateDetails){
        const eachDateFoodCategoryArr = eachDateDetails.foodCategoryDetails;;
        eachDateFoodCategoryArr.forEach(function(eachFoodCategory){
            const currentPriceList = eachFoodCategory.currentFoodCategoryPriceList;
            priceListParticularDining.push(currentPriceList);
        });
    });

    priceListKeysArray.forEach(function(eachPriceListKey){
        minPriceList[eachPriceListKey] = Infinity;
    });
    priceListParticularDining.forEach(function(eachPriceList){
        priceListKeysArray.forEach(function(key){
            minPriceList[key] = Math.min(minPriceList[key], eachPriceList[key]);
        }); 
    });
    return minPriceList;
}


function minPriceListArray(minPriceList) {
    const minPriceListInArray = Object.keys(minPriceList).map(key => {
        const spaceSeperatedChar = key.replace(/([A-Z])/g, ' $1').trim();
        const array = spaceSeperatedChar.split("Each ");
        const finalWording = "Minimum Price of ".concat(array[1]);
        const minPriceObject = {
             minPriceTitle: finalWording,
             minPrice: minPriceList[key],
        }
        return minPriceObject;
    });
    return minPriceListInArray;
}


async function Page(context){

    const slug = context.params.slug;
    const currentDiningPath = slug;
    const diningRestaurantInfo = await fetchCurrentDiningData(currentDiningPath);
    const diningWithDateInformationAllRestaurant = await fetchDiningEachDayDataAllRestaurant();

    const currentRestaurantEachDayData = diningWithDateInformationAllRestaurant.find(function(eachRestaurant){
        return eachRestaurant.diningTitle == diningRestaurantInfo.diningAreaTitle;
    });
    const currentRestaurantDateDetails = currentRestaurantEachDayData.dateDetails;
    const startingPriceOfDiningList = getDiningStartingPriceOfEachTable(currentRestaurantDateDetails);
    const startingPriceOfDiningArray = minPriceListArray(startingPriceOfDiningList);


    return (
        
        <div className={styles.diningContainer}>

            <div className={styles.breadcrumbsContainer}>
                <p>
                    <Link href="/">
                        <span className={styles.breadcrumbsLink}> HOME </span>
                    </Link> 
                    <span>{'>>'}</span> 
                    <Link href="/dining"> 
                        <span className={styles.breadcrumbsLink}> DINING </span>
                    </Link>
                    <span>{'>>'}</span> 
                    <Link href={`/dining/${currentDiningPath}`}> 
                        <span className={styles.breadcrumbsLink}> {diningRestaurantInfo.diningAreaTitle} </span>
                    </Link>
                </p>
            </div>

            <h2>{diningRestaurantInfo.diningAreaTitle}</h2>
            
            <div className={styles.topContainer}>
                <div className={styles.imageContainer}>
                    <Image src={diningRestaurantInfo.photo} alt="dining-restaurant" width={500} height={300} />
                </div>
                <div className={styles.restaurantDescription}>
                    <p className={styles.contactNo}><FontAwesomeIcon icon={faPhone} /> {diningRestaurantInfo.contactNo}</p>
                    <p className={styles.shortDescription}>{diningRestaurantInfo.shortDescription}</p>
                    <p className={styles.diningDescription}>{diningRestaurantInfo.diningDescription}</p>
                    <div className={styles.cuisineTiming}>
                        <div className={styles.cuisine}>
                            <p>Cuisines</p>
                            {(diningRestaurantInfo.cuisine).map(function(eachCuisine){
                                return (<li className={styles.eachCuisine} key={eachCuisine}>{eachCuisine}</li>)
                            })}
                        </div>
                        <div className={styles.timing}>
                            <p>Timing</p>
                            {(diningRestaurantInfo.timing).map(function(eachTime){
                                return (<div key={eachTime.foodCategory} className={styles.eachTime}>
                                    <div className={styles.foodCategory}>{eachTime.foodCategory} : </div>
                                    <div className={styles.foodTiming}>{eachTime.foodTiming}</div>
                                </div>)
                            })}
                        </div>
                    </div>
                </div>
            </div>
            
            {(Array.isArray(startingPriceOfDiningArray) &&startingPriceOfDiningArray.length > 0) &&
            <div className={styles.minPrice}>
                {startingPriceOfDiningArray.map(function(eachTablePrice){
                    return (
                        <p className={styles.eachTablePrice}>
                            {eachTablePrice.minPriceTitle}: {CURRENCY_SYMBOL}{eachTablePrice.minPrice}
                        </p>
                    )
                })}
            </div>
            }

            <div className={styles.reserveTableContainer}>
                <div className={styles.reserveTable}>
                    <DiningBookingComponent diningRestaurantInfo={diningRestaurantInfo} />
                </div>
                <div className={styles.imageContainer}>
                    <Image src={diningRestaurantInfo.photo} alt="dining-restaurant" width={500} height={300} />
                </div>
            </div>
        </div>
        
    );

}

export default Page;