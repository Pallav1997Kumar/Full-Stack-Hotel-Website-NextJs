import React from "react";
import Image from 'next/image';
import Link from 'next/link';

import styles from "./page.module.css";


export function generateMetadata(){
    return {
        title: 'Royal Palace - Facilities'
    }
}


export default function page() {
    return (
        <React.Fragment>
            <div className={styles.imageContainer}>
                <Image src={'/Fitness/Fitness-24-hr-gym.jpg'} alt="gym image" width={1400} height={500} />
            </div>

            <div className={styles.breadcrumbsContainer}>
                <p>
                    <Link href="/">
                        <span className={styles.breadcrumbsLink}> HOME </span>
                    </Link> 
                    <span>{'>>'}</span> 
                    <Link href="/facility-in-our-hotel"> 
                        <span className={styles.breadcrumbsLink}> HOTEL FACILITIES </span>
                    </Link>
                </p>
            </div>
            
            <div className={styles.facilityContainer}>
                <h2>Facilities in our hotel</h2>
                <p>Whether you are travelling for business or pleasure, the luxury hotel services offered by the five star Taj Hotel make it an ideal choice for your stay in Kolkata, West Bengal. </p>
                <p>The hotel’s luxurious surroundings, comfort, thoughtful touches and a personalized service sets it apart from any other hotel, allowing you to feel like being at home from your very first steps into the hotel.</p>
                <p>We are geared towards the fulfilment of the needs of any discerning guest and below you can find the most commonly-used services and facilities offered by our boutique hotel.</p>
                <ol>
                    <li>
                        <Link href={`/facility-in-our-hotel/spa-and-beauty-salon`}>Spa and Salon</Link>
                    </li>
                    <li>
                        <Link href={`/facility-in-our-hotel/fitness-gym`}>Fitness Centre</Link>
                    </li>
                    <li>
                        <Link href={`/facility-in-our-hotel/swimming-pool`}>Swimming Pool</Link>
                    </li>
                    <li>
                        <Link href={`/facility-in-our-hotel/indoor-games`}>Indoor Games Centre</Link>
                    </li>
                    <li>
                        <Link href={`/facility-in-our-hotel/`}>Laundry</Link>
                    </li>
                </ol>
            </div>
        </React.Fragment>
    );
}