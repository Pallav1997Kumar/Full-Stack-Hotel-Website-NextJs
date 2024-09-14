import React from "react";
import Image from 'next/image';
import Link from 'next/link';

import styles from "./page.module.css";


export function generateMetadata(){
    return {
        title: 'Royal Palace - About'
    }
}


export default function Page(){
    return (
        <React.Fragment>
            <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={600} />
            <div className={styles.breadcrumbsContainer}>
                <p>
                    <Link href="/">
                        <span className={styles.breadcrumbsLink}> HOME </span>
                    </Link> 
                    <span>{'>>'}</span> 
                    <Link href="/about"> 
                        <span className={styles.breadcrumbsLink}>ABOUT US </span>
                    </Link>
                </p>
            </div>
            <h1 className={styles.header}>ABOUT US</h1>
            <div className={styles.aboutPageContainer}>
                <div className={styles.hotelDescription}>
                    <p>Royal Palace Kolkata Hotel & Residences stands proudly as Accor Hotel's first property in Eastern India. This hotel is a gateway to the City of Joy by being Eastern India’s one of the largest five-star facility with over 340 guest rooms.</p>
                    <p>There are 47 pet friendly serviced apartments. It is centrally located with close Proximity to the airport, IT sector, key corporate houses and recreational attractions with an Imposing presence due to its colossal frontage and award-winning architecture.</p>
                    <p>The Hotel offers banqueting options spread over 30,000 sq. ft. of indoor and outdoor spaces including the city’s very first rooftop banqueting space of over 18000 sq. ft. Novotel Kolkata also specialises in multiple dining options with five outlets and the city’s largest All Day Diner.</p>
                    <p>Royal Palace Kolkata has the perfect balance of fitness and wellness which allow our guest to rejuvenate at our 24 hour fitness centre which includes Spa, swimming pool and a gym. Technologically savvy banquet halls and rooms are the perfect for today’s traveler and corporate guest.</p>
                    <p>Our multi cuisine specialty all day dining restaurant The Square delivers a memorable experience, by providing a wide range of quality international dishes. Royal Palace Kolkata hold a special Sunday Brunch for the guests to enjoy the fresh and high quality cuisine. For coffee lovers in town, we have an offering for International Brew Experience at our Blue Tokai Café outlet.</p>
                </div>
                <div>
                    <Image src={'/hotel-kolkata.jpg'} alt="hotel" width={500} height={400} />
                </div>
            </div>
        </React.Fragment>
    );
}