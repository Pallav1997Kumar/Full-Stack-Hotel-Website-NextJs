import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from "./page.module.css";

import spaImage from "../../../../public/Spa and Salon/spa-image.webp";
import salonImage from "../../../../public/Spa and Salon/salon.jpg";


export function generateMetadata(){
    return {
        title: 'Royal Palace - Spa and Salon'
    }
}


export default function page(){
    return(
        <React.Fragment>
            <div className={styles.imageContainer}>
                <Image src={'/Spa and Salon/salon.jpg'} alt="gym image" width={1400} height={500} />
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
                    <Link href="/facility-in-our-hotel/spa-and-beauty-salon"> 
                        <span className={styles.breadcrumbsLink}> SPA AND SALON </span>
                    </Link>
                </p>
            </div>

            <div className={styles.spaContainer}>
                <h2>Spa at our Hotel</h2>
                <p>Novotel Spa believes in the mantra that the mind and body needs peace to achieve spiritual and sensual bliss. We provide a serene and unforgettable experience of indulgence, relaxation and pure pampering.</p>
                <p>Combining traditional, ancient spa methods with the latest recommendations in the spa industry, our treatment menu also includes alternative spa treatments to reset the balance in your life. </p>
                <p>Our therapies are designed to elevate your senses, cleanse you of impurities, eliminate stress and restore peace & tranquility, detoxifying you from head to toe. We strive to help you achieve the balance between the body, mind and soul, experiencing a wholesome, healthy lifestyle. </p>
                <p>Unwind with every breath as our therapists relieve your body of all stress and tension, giving you unmatched radiance and a positive chi as you walk out.</p>
                <p>We invite you to enjoy life more fully with our rituals. Whether it is pampering, stress reduction or relaxation, you can look forward to receiving the best treatments from our highly skilled therapists.</p>
                <p>Timing : 07:00 hrs – 22:00 hrs</p>
                <p>Last appointment at 20:30 hrs</p>
                <div className={styles.salonSpaImage}>
                    <Image src={'/Spa and Salon/spa-image.webp'} alt="spa" width={600} height={250} />
                </div>
            </div>
            <div className={styles.salonContainer}>
                <h2>Beauty Parlour and Salon at our Hotel </h2>
                <p>In-house salon with Colors Hair, Beauty & Spa Salon, offer a variety of hair care, salon and spa services. </p>
                <p>Being one of the leading premier unisex salon chains of Kolkata, they have trained staff and a welcoming ambiance, giving you an overall satisfying visit.</p>
                <p>Timing : 10:00 hrs – 20:00 hrs</p>
                <p>Last appointment at 20:00 hrs</p>
                <div className={styles.salonSpaImage}>
                    <Image src={'/Spa and Salon/salon.jpg'} alt="salon" width={600} height={250} />
                </div>
            </div>
        </React.Fragment>
    );
}