'use client'
import React, {useState} from "react";
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import styles from "./page.module.css";

import { useAppSelector } from "@/redux store/hooks.js";


export default function Page(){

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    const [showAmountContainer, setShowAmountContainer] = useState(true);
    const [amount, setAmount] = useState('');
    const [proceedToPayment, setProceedToPayment] = useState(false);

    const [cardDetails, setCardDetails] = useState({
        cardName: "",
        cardNumber: "",
        cvvNumber: "",
        expiryMonth: "",
        expiryYear: ""
    });
    const { cardName, cardNumber, cvvNumber, expiryMonth, expiryYear } = cardDetails;

    const [cardErrorMessage, setCardErrorMesssage] = useState({
        cardNameErrorMessage: "",
        cardNumberErrorMessage: "",
        cvvNumberErrorMessage: "",
        expiryMonthErrorMessage: "",
        expiryYearErrorMessage: ""
    });
    const { cardNameErrorMessage, cardNumberErrorMessage, cvvNumberErrorMessage, expiryMonthErrorMessage, expiryYearErrorMessage } = cardErrorMessage;

    const [paymentSuccessMessage, setPaymentSuccessMessage] = useState('');
    const [paymentErrorMessage, setPaymentErrorMessage] = useState('');

    
    function cardDetailsChangeHandler(event){
        let { name, value } = event.target;
        if(name === "cardName"){
            value = value.toUpperCase();
            setCardDetails((previousInput)=>({
                ...previousInput,
                [name]: value
            }));
        }
        else if(name === "cardNumber"){
            value = value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            if(value.length <= 19){
                setCardDetails((previousInput)=>({
                    ...previousInput,
                    [name]: value
                }));
            }
        }
        else if(name === "cvvNumber"){
            value = value.replace(/\D/g, '');
            if(value.length <= 3){
                setCardDetails((previousInput)=>({
                    ...previousInput,
                    [name]: value
                }));
            }
        }
        else if(name === "expiryYear"){
            if(value.toString().length <= 4){
                setCardDetails((previousInput)=>({
                    ...previousInput,
                    [name]: value
                }));
            }
        }
        else if(name === "expiryMonth"){
            if(value.toString().length <= 2){
                setCardDetails((previousInput)=>({
                    ...previousInput,
                    [name]: value
                }));
            }
        }    
    }

    function proceedClickHandler(){
        setProceedToPayment(false);
        if(amount >= 1000){
            setProceedToPayment(true);
            setShowAmountContainer(false);
        }
    }

    function editAmountHandler(){
        setShowAmountContainer(true);
        setProceedToPayment(false);
    }

    async function cardDetailsSubmitHandler(event){
        event.preventDefault();
        const errorStateMessage = {
            cardNameErrorMessage: "",
            cardNumberErrorMessage: "",
            cvvNumberErrorMessage: "",
            expiryMonthErrorMessage: "",
            expiryYearErrorMessage: ""
        };
        setPaymentSuccessMessage('');
        setPaymentErrorMessage('');
        if(cardName !== "" && cardNumber !== "" && cvvNumber !== "" && expiryMonth !== "" && expiryYear !== ""){
            if(cardNumber.length === 19 && cvvNumber.length === 3 && expiryMonth <= 12 && expiryYear.toString().length === 4){
                try {
                    const amountInfo = {
                        amountToBeAdded: amount
                    }
                    //src\app/api/account-balance-user/add-transaction-amount-add-account/[userId]/route.js
                    const transactionResponse = await fetch(`/api/account-balance-user/add-transaction-amount-add-account/${loginUserId}`, {
                        method: 'POST',
                        body: JSON.stringify(amountInfo),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    });
                    const transactionData = await transactionResponse.json();
                    if(transactionResponse.status === 200){
                        const updatedAccountBalanceResponse = await fetch(`/api/account-balance-user/update-account-balance/${loginUserId}`, {
                            method: 'PATCH',
                            body: JSON.stringify(amountInfo),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            }
                        });
                        const updatedAccountBalanceData = await updatedAccountBalanceResponse.json();
                        if(updatedAccountBalanceResponse.status === 200){
                            setPaymentSuccessMessage(updatedAccountBalanceData.message);
                            setCardDetails({
                                cardName: "",
                                cardNumber: "",
                                cvvNumber: "",
                                expiryMonth: "",
                                expiryYear: ""
                            });
                        }
                        else{
                            setPaymentErrorMessage(updatedAccountBalanceData.errorMessage);
                        }
                    }
                    else{
                        setPaymentErrorMessage(transactionData.errorMessage);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            else{
                if(cardNumber.length !== 19){
                    errorStateMessage.cardNumberErrorMessage = 'Card Number should be 16 digits.';
                }
                if(cvvNumber.length !== 3){
                    errorStateMessage.cvvNumberErrorMessage = 'CVV Number should be 3 digits.';
                }
                if(expiryMonth > 12){
                    errorStateMessage.expiryMonthErrorMessage = 'Enter Valid Expiry Month. Cannot be more than 12.';
                }
                if(expiryYear.toString().length !== 4){
                    errorStateMessage.expiryYearErrorMessage = 'Enter Four Digit Expiry Year.';
                }
            }
        }
        else{
            if(cardName === ""){
                errorStateMessage.cardNameErrorMessage = 'Enter Card Holder Name.';
            }
            if(cardNumber === ""){
                errorStateMessage.cardNumberErrorMessage = 'Enter Card Number.';
            }
            if(cvvNumber === ""){
                errorStateMessage.cvvNumberErrorMessage = 'Enter Card CVV Number.';
            }
            if(expiryMonth === ""){
                errorStateMessage.expiryMonthErrorMessage = 'Enter Card Expiry Month.';
            }
            if(expiryYear === ""){
                errorStateMessage.expiryYearErrorMessage = 'Enter Card Expiry Year.';
            }
        } 
        setCardErrorMesssage(errorStateMessage);
    }


    return (
        <div className={styles.addMoney}>
            <h2>Add Money to Your Account</h2>

            {showAmountContainer &&
            <div className={styles.amountDetails}>   
                <label htmlFor="amount-add">
                    <div className={styles.moneyLabel}>
                        <div className={styles.amountHeading}>Enter the Amount (in Rs.): </div>
                        <div className={styles.amountInput}>
                            <input 
                                id="amount-add" 
                                type="number" 
                                min="1000" 
                                value={amount} 
                                onChange={(event)=>setAmount(event.target.value)}
                            />
                            <p className={styles.minimumAmount}>Minimum Rs.1000 to be added</p>
                        </div>
                        <div className={styles.amountProceed}>
                            <Button onClick={proceedClickHandler} size="medium" variant="outlined" color="success">Proceed</Button>
                        </div>
                    </div>
                </label>
            </div>
            }
            
            
            {proceedToPayment &&
            <div className={styles.cardDetailsContainer}> 
                <h2>Enter Your Card Details</h2>
                <form onSubmit={cardDetailsSubmitHandler}>
                    
                    <label htmlFor="card-name">
                        <div className={styles.cardLabel}>
                            <div className={styles.cardLabelTitle}>Name On the Card</div>
                            <div className={cardNameErrorMessage === '' ? styles.cardLabelInput : styles.cardLabelInputError}>
                                <input 
                                    type="text"
                                    name="cardName"
                                    placeholder="Enter Name on Card"
                                    id="card-name"
                                    onChange={cardDetailsChangeHandler}
                                    value={cardName}
                                />
                                <p className={styles.cardErrorMessage}>{cardNameErrorMessage}</p>
                            </div>
                        </div>
                    </label>
                    
                    <label htmlFor="card-number">
                        <div className={styles.cardLabel}>
                            <div className={styles.cardLabelTitle}>Card Number</div>
                            <div className={cardNameErrorMessage === '' ? styles.cardLabelInput : styles.cardLabelInputError}>
                                <input 
                                    type="text"
                                    name="cardNumber"
                                    placeholder="Enter Card Number"
                                    id="card-number"
                                    onChange={cardDetailsChangeHandler}
                                    value={cardNumber}
                                />
                                <p className={styles.cardErrorMessage}>{cardNumberErrorMessage}</p>
                            </div>
                        </div>
                    </label>
                    
                    <label htmlFor="cvv">
                        <div className={styles.cardLabel}>
                            <div className={styles.cardLabelTitle}>CVV</div>
                            <div className={cvvNumberErrorMessage === '' ? styles.cardLabelInput : styles.cardLabelInputError}>
                                <input 
                                    type="text"
                                    name="cvvNumber"
                                    placeholder="Enter CVV"
                                    id="cvv"
                                    onChange={cardDetailsChangeHandler}
                                    value={cvvNumber}
                                />
                                <p className={styles.cardErrorMessage}>{cvvNumberErrorMessage}</p>
                            </div>
                        </div>
                    </label>
                    
                    <label htmlFor="expiry-month">
                        <div className={styles.cardLabel}>
                            <div className={styles.cardLabelTitle}>Expiry Month</div>
                            <div className={expiryMonthErrorMessage === '' ? styles.cardLabelInput : styles.cardLabelInputError}>
                                <input 
                                    type="number"
                                    name="expiryMonth"
                                    placeholder="Enter Expiry Month"
                                    id="expiry-month"
                                    onChange={cardDetailsChangeHandler}
                                    value={expiryMonth}
                                />
                                <p className={styles.cardErrorMessage}>{expiryMonthErrorMessage}</p>
                            </div>
                        </div>
                    </label>

                    <label htmlFor="expiry-year">
                        <div className={styles.cardLabel}>
                            <div className={styles.cardLabelTitle}>Expiry Year</div>
                            <div className={expiryYearErrorMessage === '' ? styles.cardLabelInput : styles.cardLabelInputError}>
                                <input 
                                    type="number"
                                    name="expiryYear"
                                    placeholder="Enter Expiry Year"
                                    id="expiry-year"
                                    onChange={cardDetailsChangeHandler}
                                    value={expiryYear}
                                />
                                <p className={styles.cardErrorMessage}>{expiryYearErrorMessage}</p>
                            </div>
                        </div>
                    </label>

                    <label htmlFor="amount-add">
                        <div className={styles.cardLabel}>
                            <div className={styles.cardLabelTitle}>Amount To Be Added</div>
                            <div className={styles.cardLabelAmountInput}>
                                <input 
                                    type="number"
                                    name="amount-add"
                                    id="amount-add"
                                    value={amount}
                                    disabled
                                />
                                <p className={styles.editAmount} onClick={editAmountHandler}>
                                    <FontAwesomeIcon icon={faPenToSquare} /> Edit
                                </p>
                            </div>
                        </div>
                    </label>

                    <div className={styles.cardBtnContainer}>
                        <Button type="submit" color="success" variant="contained"> Proceed </Button>
                    </div>

                    {paymentSuccessMessage != '' &&
                        <div className={styles.paymentMessage}>
                            <p className={styles.paymentSuccessMessage}>{paymentSuccessMessage}</p>
                        </div>
                    }
                    {paymentErrorMessage != '' &&
                        <div className={styles.paymentMessage}>
                            <p className={styles.paymentErrorMessage}>{paymentErrorMessage}</p>
                        </div>
                    }

                </form>
            </div>    
            }
        </div>
    );
}

