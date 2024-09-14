import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from "./page.module.css";

import DiningComponent from "@/components/Dining Component/DiningComponent.jsx";


export function generateMetadata(){
    return {
        title: 'Dining'
    }
}


export default async function page(){

    const diningInfo = await fetchDiningInformation();
    const dining = diningInfo.dining;


    return (
        <React.Fragment>
            <div className={styles.imageContainer}>
                <Image src={'/Dining/The Chambers.jpeg'} alt="room image" width={1400} height={500} />
            </div>

            <div className={styles.breadcrumbsContainer}>
                <p>
                    <Link href="/">
                        <span className={styles.breadcrumbsLink}> HOME </span>
                    </Link> 
                    <span>{'>>'}</span> 
                    <Link href="/dining"> 
                        <span className={styles.breadcrumbsLink}> DINING </span>
                    </Link>
                </p>
            </div>

            <div className={styles.descriptionContainer}>
                <h2>DINING</h2>
                <p>For your safety and comfort we have put in place strict measures adhering to both governmental requirements and sanitary guidelines.</p>
                <p>Our dining area have been thoughtfully designed for business and leisure travellers to Kolkata; with classic furnishings, heritage style design features and modern technologies.</p>
                <p>Dining at Taj Bengal is a sheer delight to the palate with a variety of cuisines on offer in stunning settings.</p>
                <p>Connoisseurs from Kolkata and the world over savour the offerings of our award-winning fine-dining speciality restaurants in Kolkata.</p>
            </div>
            <div>
                {dining.map(function(eachDining){
                    return (<DiningComponent key={eachDining.diningAreaTitle} currentDining={eachDining} />)
                })}
            </div>           
            
        </React.Fragment>
    );
}


async function fetchDiningInformation(){
    try {
        const response = await fetch(`${process.env.URL}/api/hotel-booking-information/dining-information/`);
        const diningInfo = await response.json();
        return diningInfo;
    } catch (error) {
        console.log(error);
    }
}
