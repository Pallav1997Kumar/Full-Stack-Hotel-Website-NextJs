"use client"
import React, { useState } from "react";
import styles from "./ContactUsForm.module.css";

export default function ContactUsForm(){

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    function sumbitForm(event) {
        event.preventDefault();
    }

    return(
        <React.Fragment>
            <h1 className={styles.header}>Get in touch</h1>

            <form onSubmit={sumbitForm}>
                
                <label className={styles.label} htmlFor="name">
                    <div className={styles.eachLabel}>
                        <div className={styles.eachLabelText}>Name: </div>   
                        <div className={styles.eachLabelInput}>
                            <input 
                                type="text" 
                                value={name} 
                                id="name" 
                                onChange={(event)=> setName(event.target.value)}
                                placeholder="Enter Name" 
                            />
                        </div>
                    </div>
                </label>
                
                <label className={styles.label} htmlFor="email">
                    <div className={styles.eachLabel}>
                        <div className={styles.eachLabelText}>Email: </div>
                        <div className={styles.eachLabelInput}>
                            <input 
                                type="email" 
                                value={email} 
                                id="email" 
                                onChange={(event)=> setEmail(event.target.value)}
                                placeholder="Enter Email" 
                            />
                        </div>
                    </div>
                </label>
                
                <label className={styles.label} htmlFor="mobile-no">
                    <div className={styles.eachLabel}>
                        <div className={styles.eachLabelText}>Mobile Number: </div>
                        <div className={styles.eachLabelInput}>
                            <input 
                                type="number" 
                                value={number} 
                                id="mobile-no" 
                                onChange={(event)=> setNumber(event.target.value)}
                                placeholder="Enter Your Number" 
                            />
                        </div>
                    </div>
                </label>                

                <label className={styles.label} htmlFor="subject">
                    <div className={styles.eachLabel}>
                        <div className={styles.eachLabelText}>Subject: </div>
                        <div className={styles.eachLabelInput}>
                            <input 
                                type="text" 
                                value={subject} 
                                id="subject" 
                                onChange={(event)=> setSubject(event.target.value)}
                                placeholder="Enter Subject" 
                            />
                        </div>
                    </div>
                </label>

                <label className={styles.label} htmlFor="message">
                    Message:
                    <textarea 
                        type="text" 
                        value={message} 
                        id="message" 
                        rows="5" 
                        cols="75" 
                        onChange={(event)=> setMessage(event.target.value)}
                        placeholder="Enter Message" 
                    />
                </label>
                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.button}>SUBMIT</button>
                </div>
            </form>

        </React.Fragment>
    )
}