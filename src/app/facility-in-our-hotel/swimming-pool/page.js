import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from "./page.module.css";


export function generateMetadata(){
    return {
        title: 'Royal Palace - Swimming Pool'
    }
}


export default function page(){
    return (
        <React.Fragment>
            <div className={styles.imageContainer}>
                <Image src={'/Swimming Pool/swimming pool.jpg'} alt="swimming pool image" width={1400} height={500} />
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
                    <span>{'>>'}</span> 
                    <Link href="/facility-in-our-hotel/swimming-pool"> 
                        <span className={styles.breadcrumbsLink}> SWIMMING POOL </span>
                    </Link>
                </p>
            </div>

            <div className={styles.swimmingContainer}>
                <h1>Swimming Pool</h1>
                <p>The newly redesigned Swimming Pool at our family friendly hotel.</p>
                <p>It offers you a great venue to celebrate unforgettable moments. Enjoy our light meals and refreshing drinks at our Pool Bar. </p>
                <p>The swimming pool featured Semi Olympic size Swimming Pool. Experience your barbecue nights, prom night or any of your social event at our Swimming Pool.</p>
            </div>
        </React.Fragment>
    );
}