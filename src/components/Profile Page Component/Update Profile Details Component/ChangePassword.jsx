"use client"
import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import Button from '@mui/material/Button';
import Link from 'next/link';

import styles from './ChangePassword.module.css';

import InputAreaForEditInfo from "@/components/Input Area/InputAreaForEditInfo.jsx";
import { useAppSelector } from "@/redux store/hooks";


function ChangePassword(){

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    const pathname = usePathname();
    const urlUserId = pathname.split('/')[3];

    const [inputValue, setInputValue] = useState({
        oldPassword: "",
        newPassword: "", 
        confirmNewPassword: ""
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showProcesingButton, setShowProcesingButton] = useState(false);

    const { oldPassword, newPassword, confirmNewPassword } = inputValue;

    const isInvalidPassword = isInvalidPasswordFn();
    const disabledButton = isButtonDisabledFn();

    let passwordMismatch = false;
    if(confirmNewPassword.trim() != "" && (newPassword.trim() != confirmNewPassword.trim())){
        passwordMismatch = true;
    }
    
    let oldNewPasswordSame = false;
    if(newPassword.trim() != "" && (newPassword.trim() == oldPassword.trim())){
        oldNewPasswordSame = true;
    }

    function handleSubmit(event){
        const { name, value } = event.target;
        setInputValue((previousInput) => ({
            ...previousInput,
            [name]: value,
        }));
    }

    function isInvalidPasswordFn(){
        let isInvalidPassword = false;
        let isValidPassword = false;
        let enteredPassword = newPassword.trim();
        var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        let passwordLengthGreaterThan7 = enteredPassword.length > 7;
        let passwordLengthLessThan21 = enteredPassword.length < 21;
        let hasNumber = /[0-9]/.test(enteredPassword);
        let hasUppercase = /[A-Z]/.test(enteredPassword);
        let hasLowercase = /[a-z]/.test(enteredPassword);
        let hasSpecialCharacters = format.test(enteredPassword);
        if(enteredPassword.length > 0){
            if(passwordLengthGreaterThan7 && passwordLengthLessThan21 &&
                hasNumber && hasLowercase && hasUppercase && hasSpecialCharacters
            ){
                isValidPassword = true;
            }
            isInvalidPassword = !isValidPassword;
        }
        return isInvalidPassword;
    }

    function isButtonDisabledFn(){
        let isButtonDisabled = true;
        if(oldPassword.trim() !== "" && 
            newPassword.trim() !== "" && 
            confirmNewPassword.trim() !== "" && 
            newPassword.trim() === confirmNewPassword.trim() &&
            oldPassword.trim() !== newPassword.trim()
        ){
            isButtonDisabled = false
        }
        return isButtonDisabled;
    }

    async function submitClickHandler(){
        setShowProcesingButton(true);
        setSuccessMessage('');
        setErrorMessage('');

        const userInfo = {
            oldPassword: oldPassword.trim(),
            newPassword: newPassword.trim()
        }

        try{
            const response = await fetch(`/api/users-authentication/customers-authenticatication/update-password-information/${loginUserId}`, {
                method: 'PATCH',
                body: JSON.stringify(userInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data = await response.json();
            if(response.status === 200){
                setSuccessMessage(data.message);    
            }
            else if(response.status === 404){
                setErrorMessage(data.errorMessage);
            }
            else if(response.status === 500){
                setErrorMessage(data.errorMessage);
            }
        }
        catch (error){

        }
        finally{
            setShowProcesingButton(false);
        }
        setInputValue({
            oldPassword: "",
            newPassword: "", 
            confirmNewPassword: ""
        });
    }


    return (
        <div className={styles.pageContainer}>

            <div className={styles.breadcrumbsContainer}>
                <p>
                    <Link href="/">
                        <span className={styles.breadcrumbsLink}> HOME </span>
                    </Link> 
                    <span>{'>>'}</span> 
                    <Link href="/profile-home-page"> 
                        <span className={styles.breadcrumbsLink}> PROFILE PAGE </span>
                    </Link>
                    <span>{'>>'}</span> 
                    <Link href={`/profile-home-page/change-password/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> CHANGE PASSWORD </span>
                    </Link>
                </p>
            </div>

            <h1>Change Your Existing Password</h1>

            <InputAreaForEditInfo 
                labelName="Old Password"
                name="oldPassword" 
                type="password" 
                placeholder="Enter Old Password" 
                value={oldPassword}
                onChange={handleSubmit}
                required={true}
            />

            <InputAreaForEditInfo 
                labelName="New Password"
                name="newPassword" 
                type="password" 
                placeholder="Enter New Password" 
                value={newPassword}
                onChange={handleSubmit}
                isInvalidPassword={isInvalidPassword} 
                oldNewPasswordSame={oldNewPasswordSame}
                required={true}
            />

            <InputAreaForEditInfo 
                labelName="Confirm New Password"
                name="confirmNewPassword" 
                type="password" 
                placeholder="Re-Enter New Password" 
                value={confirmNewPassword}
                onChange={handleSubmit}
                required={true}
                passwordMismatch={passwordMismatch}
            />

            <div className={styles.buttonContainer}>
                {(!showProcesingButton && disabledButton) &&
                    <Button variant="contained" disabled> Submit </Button>
                }
                {(!showProcesingButton && !disabledButton) &&
                    <Button onClick={submitClickHandler} variant="contained"> Submit </Button>
                }
                {showProcesingButton &&
                    <Button variant="contained" disabled> Please Wait </Button>
                }
            </div>

            <div className={styles.errorSuccess}>
                {successMessage !== '' &&
                    <p className={styles.successMessage}>{successMessage}</p>
                }
                {errorMessage !== '' &&
                    <p className={styles.errorMessage}>{errorMessage}</p>
                }
            </div>

        </div>
    );

}


export default ChangePassword;