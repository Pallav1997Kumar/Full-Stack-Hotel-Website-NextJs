import React from "react";
import Image from 'next/image';
import Link from 'next/link';

import styles from "./DiningComponent.module.css";


async function DiningComponent(){
    
    const dining = await fetchDiningInformation();
    const threeDining = dining.slice(0,3)

    return (
        <div className={styles.diningContainer}>
            <h2>Dining</h2>
            <div className={styles.diningOnlyContainer}>
                <Link href={`/dining/`} passHref>
                    <p className={styles.seeMore}>SEE ALL THE DINING OPTIONS</p>
                </Link>
                <div className={styles.dining}>
                    {threeDining.map(function(eachDining){
                        return(
                            <div className={styles.eachDiningStyle}>
                                <Image src={eachDining.photo} alt="room-photo" width={375} height={300} />
                                <Link href={`/dining/${eachDining.diningPath}`} passHref>
                                    <h4>{eachDining.diningAreaTitle}</h4>
                                </Link>
                                <p>{eachDining.shortDescription}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}


async function fetchDiningInformation(){
    try {
        const response = await fetch(`${process.env.URL}/api/hotel-booking-information/dining-information/`);
        const diningInfo = await response.json();
        const dining = diningInfo.dining;
        return dining;
    } catch (error) {
        console.log(error);
    }
}


export default DiningComponent;