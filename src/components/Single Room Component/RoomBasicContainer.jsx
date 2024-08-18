"use client"
import React from 'react';
import Image from 'next/image';

import styles from "./RoomBasicContainer.module.css";


export default function RoomBasicContainer(props) {
    const roomInfo = props.roomInfo;

    return(
        <div className={styles.firstContainer}>
            <div className={styles.firstImage}>
                <Image src={roomInfo.photos[0]} alt="room-cover-image" width={600} height={350} />
            </div>
            <div className={styles.basicDescription}>
                <p>{roomInfo.description}</p>
                <div className={styles.tabular}>
                    <div className={styles.eachRow}>
                        <div className={styles.tabularHeading}><strong>Bed Type: </strong></div>
                        <div className={styles.tabularNormal}>{roomInfo.bedType}</div>
                    </div>
                    <div className={styles.eachRow}>
                        <div className={styles.tabularHeading}><strong>Total Room Size: </strong></div>
                        <div className={styles.tabularNormal}>{roomInfo.totalRoomSize}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}