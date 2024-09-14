import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faDog, faBurger } from "@fortawesome/free-solid-svg-icons";

import styles from "./HomePageHotelIntroduction.module.css";

function HomePageHotelIntroduction() {
    return(
        <div className={styles.homePageIntroduction}>
            <div className={styles.hotelIntroduction}>
                <p className={styles.hotelIntro}>Royal Palace is a landmark luxury hotel in downtown Kolkata, in the exclusive neighbourhood of Alipore at the heart of its cultural heritage. Prominent landmarks — Victoria Memorial, Royal Calcutta Race Course, Horticultural Gardens, National Library, Eden Gardens and the Alipore Zoological Gardens—are all within walking distance.</p>
                <p className={styles.hotelIntro}> It is the luxury hotel closest to government offices and most consulates. The city’s commercial centre is just two miles (three km) away; 45 minutes’ drive to the airport. </p>
                <p className={styles.hotelIntro}>But for the twinkling views of the stunning Kolkata skyline, you could forget the hotel’s location in the centre of the bustling metropolis. Nestled in the city’s greenest precinct, you are in paradise, with lush flora teeming with birdlife and clear views of the Alipore Zoological Gardens. </p>
                <p className={styles.hotelIntro}>Designed by legendary architect Bob Fox, the architecture and interiors of our 5 star hotel in Kolkata is deeply inspired by the city’s famed art, culture and heritage. All around, grandeur meets understated elegance—you are awed by the lavish five-storied stone and marble atrium, bathed in glorious gold light each afternoon. Genuine antiques, priceless art, and traditional accents and colours are impeccably woven together with contemporary style and modern amenities. </p>
                <p className={styles.hotelIntro}>Stay in our grand luxury rooms and suites, or at our Grand Presidential Suite. Indulge yourself with a day at Spa and shop for finely curated Indian artefacts at Royal Khazana. Spectacular venues make the hotel the preferred choice for business meetings, social events and weddings. </p>
                <p className={styles.hotelIntro}>The wide array of fine-dining restaurants at Royal Palace is the best in Kolkata. Enjoy robust North-West frontier, Punjabi and Bengali cuisines at the ambient Sonargaon, authentic Chinese at Chinoiserie, and Lebanese and Mediterranean at Souk. Our award-winning 24 Hour all day dining, Cal 27 serves an assortment of world cuisines; for an on-the-go craving, there is La Patisserie and Deli. The Junction Bar and Promenade Lounge are perennial favourites; and during winters, the Grill by the Pool is a special treat. </p>
                <p className={styles.hotelIntro}>Our signature Royal hospitality infuses your time at this hotel with warmth and the utmost in personal care, service and exclusivity. Be pampered by our world-renowned butlers and enjoy sumptuous in-room-dining experiences. </p>
                <p className={styles.hotelIntro}>Come, retreat into this tranquil paradise in the City of Joy.</p>
            </div>

            <div className={styles.hotelHightlightsContainer}>
                <h4 className={styles.hotelHeading}>Hotel Highlights</h4>
                <p className={styles.hotelHightlights}>
                    <FontAwesomeIcon icon={faLocationDot} /> 
                    <span className={styles.hotelHightlightsText}>Located in the Heart of the City</span>
                </p>
                <p className={styles.hotelHightlights}>
                    <FontAwesomeIcon icon={faLocationDot} /> 
                    <span className={styles.hotelHightlightsText}>Spacious Atrium Lobby</span>
                </p>
                <p className={styles.hotelHightlights}>
                    <FontAwesomeIcon icon={faDog} /> 
                    <span className={styles.hotelHightlightsText}>Pet-friendly Hotel</span>
                </p>
                <p className={styles.hotelHightlights}>
                    <FontAwesomeIcon icon={faBurger} /> 
                    <span className={styles.hotelHightlightsText}>International, Authentic Indian, Bengali, Mediterranean & Chinese Cuisine</span>
                </p>
            </div>

            <div className={styles.hotelPoliciesContainer}>
                <h4 className={styles.hotelHeading}>Hotel Policies</h4>
                <p className={styles.hotelPoliciesText}>Check-in time: 09:00 hrs </p>
                <p className={styles.hotelPoliciesText}>Check-out time: 09:00 hrs </p>
                <p className={styles.hotelPoliciesText}>Early check-in and late check-out on request</p>
                <p className={styles.hotelPoliciesText}>We accept American Express, Diner's Club, Master Card, Visa, JCB International</p>
                <p className={styles.hotelPoliciesText}>Pets are welcomed.</p>
            </div>
        </div>
    );
}

export default HomePageHotelIntroduction;