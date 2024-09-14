import Image from 'next/image';
import React from "react";
import Link from 'next/link';

import ContactUsForm from "@/components/ContactUsForm/ContactUsForm.jsx";
import styles from "./page.module.css";
import hotelBasicInfo from "@/json objects/hotelBasicInfo.js";


export function generateMetadata(){
    return {
        title: 'Royal Palace - Contact Us'
    }
}


export default function Page() {

    return (
        <React.Fragment>
            <div>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />
            </div>
            <div className={styles.breadcrumbsContainer}>
                <p>
                    <Link href="/">
                        <span className={styles.breadcrumbsLink}> HOME </span>
                    </Link> 
                    <span>{'>>'}</span> 
                    <Link href="/contactUs"> 
                        <span className={styles.breadcrumbsLink}>CONTACT US </span>
                    </Link>
                </p>
            </div>
            <div className={styles.contactInfoContainer}>
                <div>
                    <h1>CONTACT US - ROYAL PALACE, KOLKATA</h1>
                    <Image src={'/hotel-logo.jpg'} alt="icon" width={200} height={100} />
                </div>
                <div className={styles.contactInfoDiv}>
                    <div className={styles.addressEmailNumber}>
                        <h1>Address</h1>
                        <p>{hotelBasicInfo.address}</p>
                    </div>
                    <div className={styles.addressEmailNumber}>
                        <h1>Phone</h1>
                        <p>{hotelBasicInfo.contactNo}</p>
                    </div>
                    <div className={styles.addressEmailNumber}>
                        <h1>Email</h1>
                        <p>{hotelBasicInfo.emailId}</p>
                    </div>
                </div>
            </div>
            <div className={styles.getInTouch}>
                <div>
                    <ContactUsForm />
                </div>
                <div>
                    <Image src={'/royal-fort-hotel.jpg'} alt="img" width={550} height={350} />
                </div>
            </div>
        </React.Fragment>
    );
}