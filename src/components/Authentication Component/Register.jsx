"use client"
import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import Button from '@mui/material/Button';
import validator from "validator";
import { useRouter } from 'next/navigation';

import stylesLabel from "@/components/Input Area/InputAreaForRegisterLogin.module.css";
import styles from "./Register.module.css";

import InputAreaForRegisterLogin from "@/components/Input Area/InputAreaForRegisterLogin.jsx";
import { useAppDispatch } from "@/redux store/hooks.js";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";

function Register(){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const [inputValue, setInputValue] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        dob: "",
        email: "",
        contactNo: "",
        alternateContactNo: "",
        password: "",
        confirmPassword: ""
    });
    const [registrationErrorMessage, setRegistrationErrorMessage] = useState('');
    const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState('');
    const [registrationProcessing, setRegistrationProcessing] = useState(false);

    const { firstName, middleName, lastName, dob, gender, email, contactNo, alternateContactNo, password, confirmPassword } = inputValue;

    let fullName;
    if(middleName.trim() !== ""){
        fullName = firstName.concat(' ', middleName, ' ', lastName);
    }
    else{
        fullName = firstName.concat(' ', lastName);
    }

    let passwordMismatch = false;
    if(confirmPassword != "" && (password != confirmPassword)){
        passwordMismatch = true;
    }

    let genderInputGiven = false;
    if(gender !== ""){
        genderInputGiven = true;
    } 
    
    const isInvalidEmail = isInvalidEmailFn();
    const isInvalidPassword = isInvalidPasswordFn();

    const disabledButton = isButtonDisabledFn();

    function handleChange(event){
        const { name, value } = event.target;
        setInputValue((previousInput) => ({
            ...previousInput,
            [name]: value,
        }));
    }

    function isInvalidEmailFn(){
        let isInvalidEmail = false;
        if(email.trim()!== ""){
            if (validator.isEmail(email)){
                isInvalidEmail = false;
            }
            else{
                isInvalidEmail = true;
            }
        }
        return isInvalidEmail;
    }

    function isInvalidPasswordFn(){
        let isInvalidPassword = false;
        let isValidPassword = false;
        let enteredPassword = password.trim();
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
        if(firstName.trim() !== "" &&
            lastName.trim() !== "" && 
            gender.trim() !== "" && 
            dob.trim() !== "" && 
            email.trim() !== "" &&
            !isInvalidEmailFn() && 
            contactNo.trim() !== "" && 
            password.trim() !== "" && 
            confirmPassword.trim() !== "" && 
            password.trim() === confirmPassword.trim()
        ){
            isButtonDisabled = false
        }
        return isButtonDisabled;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const registrationInputData = {
            firstName: firstName.trim(),
            middleName: middleName.trim(),
            lastName: lastName.trim(),
            fullName: fullName.trim(),
            gender: gender.trim(),
            dob: dob.trim(),
            email: email.trim(),
            contactNo: contactNo.trim(),
            alternateContactNo: alternateContactNo.trim(),
            password: password.trim(),
        }
        console.log(registrationInputData);
        setRegistrationSuccessMessage('');
        setRegistrationErrorMessage('');
        setRegistrationProcessing(true);

        try {
            const response = await fetch('api/users-authentication/customers-authenticatication/register', {
                method: 'POST',
                body: JSON.stringify(registrationInputData),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data = await response.json();
            if(response.status === 404){
                setRegistrationErrorMessage(data.errorMessage);
            }
            if(response.status === 500){
                setRegistrationErrorMessage(data.errorMessage);
            }
            if(response.status === 200){
                setRegistrationSuccessMessage(data.message);
                setInputValue({
                    firstName: "",
                    middleName: "",
                    lastName: "",
                    gender: "",
                    dob: "",
                    email: "",
                    contactNo: "",
                    alternateContactNo: "",
                    password: "",
                    confirmPassword: ""
                });
            }
        } catch (error) {
            console.log(error);
        }
        finally{
            setRegistrationProcessing(false);
        }
    }


    function loginPageClickHandler(event){
        event.preventDefault();
        const loginPageCalledFrom = 'Registration Page';
        const loginRedirectPage = '/profile-home-page';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/login');
    }


    return(
        <div className={styles.registerContainer}>
            <div className={styles.registerFormPart}>
                <h1>Register to Hotel</h1>
                <form onSubmit={handleSubmit}>

                    <h4 className={styles.heading}>Name</h4>
                    
                    <InputAreaForRegisterLogin 
                        labelName="First Name" 
                        name="firstName" 
                        type="text" 
                        placeholder="Enter First Name" 
                        value={firstName} 
                        onChange={handleChange} 
                    />
                    
                    <InputAreaForRegisterLogin 
                        labelName="Middle Name" 
                        name="middleName" 
                        type="text" 
                        placeholder="Enter Middle Name (if any)" 
                        value={middleName} 
                        onChange={handleChange} 
                    />
                    
                    <InputAreaForRegisterLogin 
                        labelName="Last Name" 
                        name="lastName" 
                        type="text" 
                        placeholder="Enter Last Name" 
                        value={lastName} 
                        onChange={handleChange} 
                    />
                    
                    <InputAreaForRegisterLogin 
                        labelName="Full Name" 
                        name="fullName" 
                        type="text" 
                        placeholder="Your Full Name" 
                        disabled={true} 
                        value={fullName} 
                    />

                    
                    <h4 className={styles.heading}>Basic Information</h4>

                    <div className={stylesLabel.labelContainer}>
                        <label htmlFor="gender">
                            <div className={stylesLabel.eachLabelContainer}>
                                <div className={stylesLabel.labelName}>Gender: </div>
                                <div className={stylesLabel.labelInput}>
                                    <select className={styles.selectDropdown} onChange={handleChange} name="gender" id="gender">
                                        <option value="">Choose Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {!genderInputGiven && <div className={stylesLabel.error}>Gender cannot be blank</div>}
                                </div>
                            </div>
                        </label>
                    </div>
                    
                    <InputAreaForRegisterLogin 
                        labelName="Date of Birth" 
                        name="dob" 
                        type="date" 
                        value={dob} 
                        onChange={handleChange} 
                    />
                    
                    
                    <h4 className={styles.heading}>Contact Information</h4>
                    
                    <InputAreaForRegisterLogin 
                        labelName="Email Address" 
                        name="email" 
                        type="email" 
                        placeholder="Enter Email Address" 
                        value={email} 
                        isInvalidEmail={isInvalidEmail} 
                        onChange={handleChange} 
                    />
                    
                    <InputAreaForRegisterLogin 
                        labelName="Contact Number" 
                        name="contactNo"
                        type="number" 
                        placeholder="Enter Contact Number" 
                        value={contactNo} 
                        onChange={handleChange} 
                    />
                    
                    <InputAreaForRegisterLogin 
                        labelName="Alternate Contact Number" 
                        name="alternateContactNo" 
                        type="number" 
                        placeholder="Enter Alternate Contact Number" 
                        value={alternateContactNo} 
                        onChange={handleChange} 
                    />
                    
                    
                    <h4 className={styles.heading}>Password</h4>
                    
                    <InputAreaForRegisterLogin 
                        labelName="Password" 
                        name="password" 
                        type="password" 
                        placeholder="Enter Password" 
                        value={password} 
                        isInvalidPassword={isInvalidPassword} 
                        onChange={handleChange} 
                    />

                    <InputAreaForRegisterLogin 
                        labelName="Confirm Password" 
                        name="confirmPassword" 
                        type="password" 
                        placeholder="Re-Enter Password" 
                        value={confirmPassword}
                        passwordMismatch={passwordMismatch}
                        onChange={handleChange} 
                    />
                    
                    
                    <div className={styles.buttonContainer}>
                        {(disabledButton && !registrationProcessing) && 
                            <Button type="sumbit" variant="contained" disabled>Register</Button>
                        }

                        {(!disabledButton && !registrationProcessing) && 
                            <Button type="submit" variant="contained">Register</Button>
                        }

                        {registrationProcessing &&
                            <Button type="sumbit" variant="contained" disabled>Please Wait</Button>
                        }
                    </div>
                    
                    
                    <div className={styles.errorOrSucessMessage}>
                        {(registrationErrorMessage != '') &&
                        <p className={styles.error}>{registrationErrorMessage}</p>
                        }
                        {(registrationSuccessMessage != '') &&
                        <p className={styles.success}>{registrationSuccessMessage}</p>
                        }
                    </div>
                </form>
                
                <div className={styles.loginNavigation}>
                    <p>Already have an account</p>
                    <p className={styles.loginLink}>
                        <Link onClick={loginPageClickHandler} href='/login'>Click here to Login</Link>
                    </p>
                </div>

            </div>
            <div className={styles.imagePart}>
                <Image src={'/hotel-kolkata.jpg'} alt="hotel" width={500} height={350} />
                <Image src={'/hotel-kolkata.jpg'} alt="hotel" width={500} height={350} />
                <Image src={'/hotel-kolkata.jpg'} alt="hotel" width={500} height={350} />
            </div>
        </div>
    )
}

export default Register;