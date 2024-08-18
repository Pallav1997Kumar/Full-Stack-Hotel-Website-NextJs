import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";

import styles from "./BasicContactInformation.module.css";

import hotelBasicInfo from "@/json objects/hotelBasicInfo.js";


function BasicContactInformation() {
    return(
        <React.Fragment>
            <p className={styles.hotelBasicInfoStyle}>
                <FontAwesomeIcon icon={faLocationDot} /> 
                <span className={styles.hotelBasicInfoDetails}>{hotelBasicInfo.address} </span>
            </p>
            <p className={styles.hotelBasicInfoStyle}>
                <FontAwesomeIcon icon={faPhone} /> 
                <span className={styles.hotelBasicInfoDetails}>{hotelBasicInfo.contactNo} </span>
            </p>
            <p className={styles.hotelBasicInfoStyle}>
                <FontAwesomeIcon icon={faEnvelope} /> 
                <span className={styles.hotelBasicInfoDetails}>{hotelBasicInfo.emailId} </span>
            </p>
        </React.Fragment>
    );
}

export default BasicContactInformation