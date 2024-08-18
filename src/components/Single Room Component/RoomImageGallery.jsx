"use client"
import React from 'react';
import Image from 'next/image';

import styles from "./RoomImageGallery.module.css";


export default function RoomImageGallery(props) {
    const roomInfo = props.roomInfo;
    const noOfPhotos = roomInfo.photos.length;

    return (
        <div className={styles.imageGalleryContainer}>
            <h3>Gallery</h3>
            {noOfPhotos == 3 && 
            <div className={styles.imagesGallery}>
                {(roomInfo.photos).map(function(element){
                    return (
                        <div key={element} className={styles.threeGalleryImage}>
                            <Image src={element} alt="room-image" width={330} height={200} />
                        </div>
                    )
                })}
            </div>
            }
            {noOfPhotos == 4 && 
            <div className={styles.multipleImageGallery}>
                <div className={styles.imagesGallery}>
                    {(roomInfo.photos.slice(0,2)).map(function(element){
                        return (
                            <div key={element} className={styles.twoGalleryImage}>
                                <Image src={element} alt="room-image" width={500} height={200} />
                            </div>
                        )
                    })}
                </div>
                <div className={styles.imagesGallery}>
                    {(roomInfo.photos.slice(2,4)).map(function(element){
                        return (
                            <div key={element} className={styles.twoGalleryImage}>
                                <Image src={element} alt="room-image" width={500} height={200} />
                            </div>
                        )
                    })}
                </div>
            </div>
            }
            {noOfPhotos == 5 && 
            <div className={styles.multipleImageGallery}>
                <div className={styles.imagesGallery}>
                    {(roomInfo.photos.slice(0,3)).map(function(element){
                        return (
                            <div key={element} className={styles.threeGalleryImage}>
                                <Image src={element} alt="room-image" width={330} height={200} />
                            </div>
                        )
                    })}
                </div>
                <div className={styles.imagesGallery}>
                    {(roomInfo.photos.slice(3,5)).map(function(element){
                        return (
                            <div key={element} className={styles.twoGalleryImage}>
                                <Image src={element} alt="room-image" width={500} height={200} />
                            </div>
                        )
                    })}
                </div>
            </div>
            }
        </div>
    );
}