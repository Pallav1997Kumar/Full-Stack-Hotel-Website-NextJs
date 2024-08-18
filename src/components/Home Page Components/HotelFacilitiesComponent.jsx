import React from "react";
import Image from 'next/image';
import Link from 'next/link';

import styles from "./HotelFacilitiesComponent.module.css";


function HotelFacilitiesComponent(){
    return(
        <div className={styles.hotelFacilitiesContainer}>
            <h2>Facilities in Our Hotel</h2>
            <div className={styles.facilitiesContainer}>
                <Link href={`/facility-in-our-hotel/`} passHref>
                    <p className={styles.seeMore}>SEE ALL THE FACILITIES</p>
                </Link>
                <div className={styles.onlyFacilitiesContainer}>
                    <div className={styles.eachFacility}>
                        <Image src={'/Fitness/Fitness-24-hr-gym.jpg'} alt="fitness-gym" width={375} height={300} />
                        <Link href={`/facility-in-our-hotel/fitness-gym`}>
                            <h4>Fitness Centre</h4>
                        </Link>
                    </div>
                    <div className={styles.eachFacility}>
                        <Image src={'/Spa and Salon/salon.jpg'} alt="salon" width={375} height={300} />
                        <Link href={`/facility-in-our-hotel/spa-and-beauty-salon`}>
                            <h4>Spa and Salon</h4>
                        </Link>
                    </div>
                    <div className={styles.eachFacility}>
                        <Image src={'/Swimming Pool/swimming pool.jpg'} alt="swimming-pool" width={375} height={300} />
                        <Link href={`/facility-in-our-hotel/swimming-pool`}>
                            <h4>Swimming Pool</h4>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HotelFacilitiesComponent;