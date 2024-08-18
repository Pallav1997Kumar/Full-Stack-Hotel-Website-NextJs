"use client"
import styles from "./ContactUsContainer.module.css";
import hotelBasicInfo from "@/json objects/hotelBasicInfo.js";


export default function ContactUsContainer(props) {
    return (
        <div className={styles.contactUsContainer}>
            <h3>Contact Us</h3>
            <div className={styles.tabular}>
                <div className={styles.eachRow}>
                    <div className={styles.tabularHeading}><strong>Email: </strong></div>
                    <div className={styles.tabularNormal}>{hotelBasicInfo.emailId}</div>
                </div>
                <div className={styles.eachRow}>
                    <div className={styles.tabularHeading}><strong>Contact Number: </strong></div>
                    <div className={styles.tabularNormal}>{hotelBasicInfo.contactNo}</div>
                </div>
                </div>
        </div>
    );
}