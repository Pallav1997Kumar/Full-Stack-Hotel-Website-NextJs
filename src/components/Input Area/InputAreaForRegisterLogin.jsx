"use client"
import React from "react";

import styles from "./InputAreaForRegisterLogin.module.css";

export default function InputAreaForRegisterLogin(props) {
    const { labelName, name, type, placeholder, value, onChange, passwordMismatch, disabled, isInvalidEmail, isInvalidPassword } = props;
    let isInputError = false;
    if(value === ""){
        if(labelName != "Middle Name" && labelName != "Alternate Contact Number"){
            isInputError = true;
        }
    }

    return(
        <React.Fragment>
            <div className={styles.labelContainer}>
                <label htmlFor={labelName}>
                    <div className={styles.eachLabelContainer}>
                        <div className={styles.labelName}>{labelName}: </div>
                        <div className={styles.labelInput}>
                            <input 
                                id={labelName} 
                                disabled={disabled} 
                                name={name} 
                                type={type} 
                                placeholder={placeholder} 
                                value={value} 
                                onChange={onChange} 
                            /> 
                            
                            {isInputError && 
                                <div className={styles.error}>{labelName} cannot be blank</div>
                            }

                            {passwordMismatch && 
                                <div className={styles.error}>Password and Confirm Password does not match</div>
                            }

                            {isInvalidEmail && 
                                <div className={styles.error}>Enter Valid Email</div>
                            }

                            {isInvalidPassword && 
                                <div className={styles.error}>Enter Valid Password</div>
                            }
                        </div>
                    </div>
                </label>
            </div>
        </React.Fragment>
    )
}

