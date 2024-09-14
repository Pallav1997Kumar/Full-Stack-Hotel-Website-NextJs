import Image from 'next/image'
import React from "react";

import styles from "./page.module.css";

import BasicContactInformation from "@/components/Home Page Components/BasicContactInformation.jsx";
import HomePageHotelIntroduction from "@/components/Home Page Components/HomePageHotelIntroduction.jsx";
import RoomsAndSuitesComponent from "@/components/Home Page Components/RoomsAndSuitesComponent.jsx";
import DiningComponent from "@/components/Home Page Components/DiningComponent.jsx";
import EventsMeetingComponent from "@/components/Home Page Components/EventsMeetingComponent.jsx";
import HotelFacilitiesComponent from "@/components/Home Page Components/HotelFacilitiesComponent.jsx";


export function generateMetadata(){
  return {
      title: 'Royal Palace'
  }
}


export default function Home() {
  return (
    <React.Fragment>
      <div>
        <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />
      </div>
      <h1 className={styles.hotelName}>Royal Palace</h1>
      <h4 className={styles.hotelSubIntro}>5 Star Hotel in Kolkata near Victoria Memorial</h4>
      <BasicContactInformation />
      <HomePageHotelIntroduction />
      <RoomsAndSuitesComponent />
      <DiningComponent />
      <EventsMeetingComponent />
      <HotelFacilitiesComponent />
    </React.Fragment>
  );
}
