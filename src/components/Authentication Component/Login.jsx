"use client"
import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import validator from "validator";

import styles from "./Login.module.css";

import InputAreaForRegisterLogin from "@/components/Input Area/InputAreaForRegisterLogin.jsx";
import { useAppDispatch , useAppSelector} from "@/redux store/hooks.js";
import { login } from "@/redux store/features/Auth Features/loginUserDetailsSlice.js";


function Login(){
    const router = useRouter();

    const loginPageCalledFrom = useAppSelector((reduxStore)=> reduxStore.loginPageCalledFromSliceName.loginPageCalledFrom);
    const loginRedirectPage = useAppSelector((reduxStore)=> reduxStore.loginPageCalledFromSliceName.loginRedirectPage);

    const dispatch = useAppDispatch();

    const [inputValue, setInputValue] = useState({
        email: "",
        password: ""
    });
    const [loginProcessing, setLoginProcessing] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState('');

    const { email, password } = inputValue;

    const disabledButton = isButtonDisabledFn();
    const isInvalidEmail = isInvalidEmailFn();

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

    function isButtonDisabledFn(){
        let isButtonDisabled = true;
        if(email.trim() !== "" &&
            !isInvalidEmailFn() && 
            password.trim() !== ""
        ){
            isButtonDisabled = false
        }
        return isButtonDisabled;
    }

    async function handleSubmit(event){
        event.preventDefault();
        const loginInputData = {
            email,
            password
        };
        setLoginErrorMessage('');
        setLoginProcessing(true);
        console.log(loginInputData);
        try {
            const response = await fetch('api/users-authentication/customers-authenticatication/login', {
                method: 'POST',
                body: JSON.stringify(loginInputData),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            console.log(response);
            const data = await response.json();
            console.log(data);
            if(response.status === 404){
                setLoginErrorMessage(data.errorMessage);
            }
            if(response.status === 500){
                setLoginErrorMessage(data.errorMessage);
            }
            if(response.status === 200){
                const loginUserDetails = data.loginUserDetails;
                dispatch(login(loginUserDetails));
                localStorage.setItem('loginUserDetails', JSON.stringify(loginUserDetails));
                // router.push('/profile-home-page');
                router.push(loginRedirectPage);
            }
        } catch (error) {
            console.log(error);
        } finally{
            setLoginProcessing(false);
        }

    }

    return(
        <div className={styles.loginContainer}>
            <div className={styles.loginFormPart}>
                <h1>Login to Hotel</h1>
                <form onSubmit={handleSubmit}>
                    
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
                        labelName="Password" 
                        name="password" 
                        type="password" 
                        placeholder="Enter Password" 
                        value={password} 
                        onChange={handleChange} 
                    />
                    
                    <div className={styles.buttonContainer}>
                        {(disabledButton && !loginProcessing) && 
                            <Button type="sumbit" variant="contained" disabled>Login</Button>
                        }
                        {(!disabledButton && !loginProcessing) && 
                            <Button type="submit" variant="contained">Login</Button>
                        }
                        {(loginProcessing) && 
                            <Button type="submit" variant="contained" disabled>Please Wait...</Button>
                        }
                    </div>
                    
                    <div className={styles.errorMessageContainer}>
                        {(loginErrorMessage != '') &&
                        <p>{loginErrorMessage}</p>
                        }
                    </div>
                </form>
                
                <div className={styles.registerNavigation}>
                    <p>Don't have an account</p>
                    <p className={styles.registerLink}>
                        <Link href='/register'>Click here to Register</Link>
                    </p>
                </div>
            </div>
            <div className={styles.imagePart}>
                <Image src={'/hotel-kolkata.jpg'} alt="hotel" width={500} height={350} />
            </div>
        </div>
    )
}

export default Login;