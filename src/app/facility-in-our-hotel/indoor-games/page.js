import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from "./page.module.css";


export function generateMetadata(){
    return {
        title: 'Royal Palace - Indoor Games'
    }
}


export default function page() {
    return (
        <React.Fragment>
            <div className={styles.imageContainer}>
                <Image src={'/Indoor Games/indoor -games.jpg'} alt="gym image" width={1400} height={500} />
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
                    <Link href="/facility-in-our-hotel/indoor-games"> 
                        <span className={styles.breadcrumbsLink}> INDOOR GAMES CENTRE </span>
                    </Link>
                </p>
            </div>

            <div className={styles.gamesHeaderContainer}>
                <h2>Indoor Games at our hotel</h2>
                <p>Gaming is not always about to sweat, many games can relax and revive you even if you are sitting inside a room. </p>
                <p>At our hotel's clubhouse, we bring you such an opportunity where you can play your favorite indoor games at the most comfortable surroundings.</p>
                <p>We offer an array of indoor games ranging from billiards, chess, carrom to cards. The best part of our indoor gaming area is that we offer friendly and relaxing zones adequate for both men and women.</p>
                <p>You can come and enjoy your quality time with buddies and family members with no hesitation at our club indoor gaming zones.</p>
            </div>
            <div className={styles.gamesListContainer}>
                <h4>List of Indoor Games</h4>
                <div className={styles.gamesList}>
                    <div className={styles.gamesListEach}>
                        <li>Table Tennis</li>
                        <Image src={'/Indoor Games/table-tennis.jpg'} alt="table-tennis" width={500} height={300} />
                        <li>Carrom</li>
                        <Image src={'/Indoor Games/carrom.jpg'} alt="carrom" width={500} height={300} />
                        <li>Ludo</li>
                        <Image src={'/Indoor Games/ludo.jpg'} alt="ludo" width={500} height={300} />
                        <li>Snooker</li>
                        <Image src={'/Indoor Games/snooker.jpg'} alt="snooker" width={500} height={300} />
                    </div>
                    <div className={styles.gamesListEach}>
                        <li>Chess</li>
                        <Image src={'/Indoor Games/chess.jpg'} alt="chess" width={500} height={300} />
                        <li>Tabletop Football</li>
                        <Image src={'/Indoor Games/foosball-table-hotel.webp'} alt="foosball" width={500} height={300} />
                        <li>Billiards</li>
                        <Image src={'/Indoor Games/billiards.jpg'} alt="billards" width={500} height={300} />
                        <li>Cards Games</li>
                        <Image src={'/Indoor Games/people-playing-cards.webp'} alt="cards" width={500} height={300} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}