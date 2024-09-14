"use client"
import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import Button from '@mui/material/Button';
import Link from 'next/link';

import styles from './UpdatePersonalInformation.module.css';

import InputAreaForEditInfo from "@/components/Input Area/InputAreaForEditInfo.jsx";
import stylesLabel from "@/components/Input Area/InputAreaForEditInfo.module.css";
import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { updateUserDetails } from "@/redux store/features/Auth Features/loginUserDetailsSlice.js";


function UpdatePersonalInformation(){

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;
    const loginUserFullName = loginUserDetails.fullName;
    const emailAddress = loginUserDetails.emailAddress;

    const dispatch = useAppDispatch();

    const pathname = usePathname();
    const urlUserId = pathname.split('/')[3];
    
    const [loginCustomerInfo, setLoginCustomerInfo] = useState(null);

    const [inputValue, setInputValue] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        dob: '',
        contactNo: '',
        alternateContactNo: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showProcesingButton, setShowProcesingButton] = useState(false);
    

    const { firstName, middleName, lastName, gender, dob, contactNo, alternateContactNo } = inputValue;
    

    useEffect(()=>{
        if(loginUserId == urlUserId){
            fetchLoginUsersDetailsDb(loginUserId);
        }
    }, [loginUserId, urlUserId]);

    useEffect(()=>{
        if(loginCustomerInfo){
            setInputValue({
                firstName: loginCustomerInfo.firstName || '',
                middleName: loginCustomerInfo.middleName || '',
                lastName: loginCustomerInfo.lastName || '',
                gender: loginCustomerInfo.gender || '',
                dob: (loginCustomerInfo.dateOfBirth).split('T')[0] || '',
                contactNo: loginCustomerInfo.contactNo || '',
                alternateContactNo: loginCustomerInfo.alternateContactNo || ''
            });
        }
    }, [loginCustomerInfo]);
  

    let fullName;
    if(middleName.trim() !== ""){
        fullName = firstName.concat(' ', middleName, ' ', lastName);
    }
    else{
        fullName = firstName.concat(' ', lastName);
    }

    const isSubmitButtonDisabled = isSubmitButtonDisabledFn();


    async function fetchLoginUsersDetailsDb(loginUserId) {
        try {
            const response = await fetch(`/api/users-authentication/customers-authenticatication/login-user-information/${loginUserId}`);
            const data = await response.json();
            if(response.status == 200){
                setLoginCustomerInfo(data.loginUserDetails);   
            }
        } catch (error) {
            console.log(error); 
        }
    }

    function handleChange(event){
        const { name, value } = event.target;
        setInputValue((previousInput) => ({
            ...previousInput,
            [name]: value,
        }));
    }


    function isSubmitButtonDisabledFn(){
        //Submit button will disabled if any mandatory filed is empty or we have not changed any input
        const isAnyMandatoryFieldEmpty = firstName.trim() == "" || 
                                            lastName.trim() == "" || 
                                            gender.trim() == "" || 
                                            contactNo.toString().trim() == "";
        let isAnyInputChanged = false;
        if(loginCustomerInfo != null){
            isAnyInputChanged = (loginCustomerInfo.firstName != firstName.trim()) ||
                                (loginCustomerInfo.middleName != middleName.trim()) ||
                                (loginCustomerInfo.lastName != lastName.trim()) ||
                                (loginCustomerInfo.gender != gender.trim()) ||
                                (loginCustomerInfo.contactNo != contactNo.toString().trim()) ||
                                (loginCustomerInfo.alternateContactNo != alternateContactNo.toString().trim()) ||
                                (loginCustomerInfo.dateOfBirth.split('T')[0].trim() != dob.trim())
        }
        const isButtonDisabled = !isAnyInputChanged || isAnyMandatoryFieldEmpty;
        return isButtonDisabled;
    }

    async function submitClickHandler() {
        console.log(inputValue);
        setSuccessMessage('');
        setErrorMessage('');
        setShowProcesingButton(true);
        const updatedUserInfo = {
            firstName: firstName.trim(),
            middleName: middleName.trim(),
            lastName: lastName.trim(),
            fullName: fullName.trim(),
            gender: gender.trim(),
            dob: dob.trim(),
            contactNo: contactNo,
            alternateContactNo: alternateContactNo
        }
        
        try {
            const response = await fetch(`/api/users-authentication/customers-authenticatication/update-basic-information/${loginUserId}`, {
                method: 'PATCH',
                body: JSON.stringify(updatedUserInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data = await response.json();
            if(response.status === 200){
                setSuccessMessage(data.message);
                const updatedFullName =  updatedUserInfo.fullName;
                if(loginUserFullName !== updatedFullName){
                    console.log('Full Name Changed');
                    const updatedUserInfo = {
                        userId: loginUserId,
                        emailAddress: emailAddress,
                        fullName: updatedFullName
                    }
                    dispatch(updateUserDetails(updatedUserInfo));
                }
            }
            if(response.status === 404){
                setErrorMessage(data.errorMessage);
            }
            if(response.status === 500){
                setErrorMessage(data.errorMessage);
            }
        } catch (error) {
            
        }
        finally {
            setShowProcesingButton(false);
        }
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
                    <Link href={`/profile-home-page/edit-personal-information/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> EDIT PERSONAL INFORMATION </span>
                    </Link>
                </p>
            </div>

            <h1>Edit Your Personal Information</h1>

            <div className={styles.nameContainer}>
                <h2>Name Edit Section</h2>

                <InputAreaForEditInfo 
                    labelName="First Name" 
                    name="firstName" 
                    type="text" 
                    placeholder="Enter First Name" 
                    value={firstName} 
                    onChange={handleChange}
                    required={true}
                />

                <InputAreaForEditInfo 
                    labelName="Middle Name" 
                    name="middleName" 
                    type="text" 
                    placeholder="Enter Middle Name (if any)" 
                    value={middleName} 
                    onChange={handleChange} 
                    required={false}
                />
                    
                <InputAreaForEditInfo 
                    labelName="Last Name" 
                    name="lastName" 
                    type="text" 
                    placeholder="Enter Last Name" 
                    value={lastName} 
                    onChange={handleChange} 
                    required={true}
                />
                    
                <InputAreaForEditInfo 
                    labelName="Full Name" 
                    name="fullName" 
                    type="text" 
                    placeholder="Your Full Name" 
                    disabled={true} 
                    value={fullName} 
                    required={true}
                />
            </div>


            <div className={styles.genderDobContainer}>
                <h2>Basic Information Edit Section</h2>

                <div className={stylesLabel.labelContainer}>
                    <label htmlFor="gender">
                        <div className={stylesLabel.eachLabelContainer}>
                            <div className={stylesLabel.labelName}>
                                Gender: <span className={stylesLabel.required}> * </span>
                            </div>
                            <div className={stylesLabel.labelInput}>
                                <select className={styles.selectDropdown} value={gender} onChange={handleChange} name="gender" id="gender">
                                    <option value="">Choose Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {(gender == "") &&
                                    <p className={stylesLabel.error}>Gender cannot be blank</p>
                                }
                            </div>
                        </div>
                    </label>
                </div>

                <InputAreaForEditInfo 
                    labelName="Date of Birth" 
                    name="dob" 
                    type="date" 
                    value={dob} 
                    onChange={handleChange} 
                    required={true}
                />

            </div>


            <div className={styles.contactContainer}>
                <h2>Contact Information Edit Section</h2>

                <InputAreaForEditInfo 
                    labelName="Contact Number" 
                    name="contactNo"
                    type="number" 
                    placeholder="Enter Contact Number" 
                    value={contactNo} 
                    onChange={handleChange} 
                    required={true}
                />
                    
                <InputAreaForEditInfo 
                    labelName="Alternate Contact Number" 
                    name="alternateContactNo" 
                    type="number" 
                    placeholder="Enter Alternate Contact Number" 
                    value={alternateContactNo} 
                    onChange={handleChange} 
                    required={false}
                />
                
            </div>

            <div className={styles.buttonContainer}>
                {(isSubmitButtonDisabled && !showProcesingButton) && 
                    <Button variant="contained" disabled> Submit </Button>
                }
                {(!isSubmitButtonDisabled && !showProcesingButton) &&
                    <Button onClick={submitClickHandler} variant="contained"> Submit </Button>
                }
                {showProcesingButton &&
                    <Button variant="contained" disabled> Please Wait </Button>
                }
            </div>

            <div className={styles.successErrorMessage}>
                {successMessage !== '' &&
                    <p className={styles.successMessage}>{successMessage}</p>
                }
                {errorMessage != '' &&
                    <p className={styles.errorMessage}>{errorMessage}</p>
                }
            </div>


        </div>
    )
}

export default UpdatePersonalInformation;