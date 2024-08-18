"use client"
import React from "react";

import styles from "./InputAreaForEditInfo.module.css";


function InputAreaForEditInfo(props){
    
    const { labelName, name, type, placeholder, value, required,  onChange, passwordMismatch, disabled, isInvalidPassword, oldNewPasswordSame } = props;

    return(
        <React.Fragment>
            <div className={styles.labelContainer}>
                <label htmlFor={labelName}>
                    <div className={styles.eachLabelContainer}>
                        <div className={styles.labelName}>
                            {labelName}: 
                            {required && 
                                <span className={styles.required}> * </span>
                            }
                        </div>
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

                            {(required && value == "") &&
                                <p className={styles.error}>{labelName} cannot be blank</p>
                            }

                            {isInvalidPassword && 
                                <p className={styles.error}>Enter Valid Password</p>
                            }

                            {(oldNewPasswordSame && !isInvalidPassword) &&
                                <p className={styles.error}>Old Password and New Password can't be same</p>
                            }

                            {passwordMismatch && 
                                <p className={styles.error}>Password and Confirm Password does not match</p>
                            }
                            
                        </div>
                    </div>
                </label>
            </div>
        </React.Fragment>
    );
}

export default InputAreaForEditInfo;