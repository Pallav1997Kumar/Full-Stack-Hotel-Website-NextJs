'use client'
import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import styles from './page.module.css';

import { useAppSelector } from "@/redux store/hooks";
import { utcTimeToISTConvesion } from "@/functions/date.js";


const tableHeadingStyle = {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    backgroundColor: 'rgb(55, 47, 45)',
    color: 'rgb(232, 219, 216)'
}


export default function Page() {
    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    const [loginCustomerInfo, setLoginCustomerInfo] = useState(null);
    const [showTransaction, setShowTransaction] = useState(false);
    const [transactionHistoryFound, setTransactionHistoryFound] = useState(false);
    const [transactionHistory, setTransactionHistory] = useState(null);

    if(transactionHistory != null){
        transactionHistory.sort(function(a,b){
            return new Date(b.transactionDateTime) - new Date(a.transactionDateTime)
        });
    }
    

    useEffect(()=>{
        fetchLoginUsersDetailsDb(loginUserId);
        fetchUserTransactionHistory(loginUserId);
    }, []);

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

    async function fetchUserTransactionHistory(loginUserId) {
        try {
            const response = await fetch(`/api/account-balance-user/view-transaction-history/${loginUserId}`);
            const data = await response.json();
            if(response.status === 200){
                if(data.message === 'No Tansacation History Found'){
                    setTransactionHistoryFound(false);
                }
                else if(data.message === 'Transaction History'){
                    setTransactionHistoryFound(true);
                    setTransactionHistory(data.transactionHistory);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className={styles.viewBalancePage}>
            {(loginCustomerInfo != null) && 
            <div className={styles.viewBalance}>
                <div className={styles.viewBalanceAmount}>
                    <h3>Account Balance: </h3>
                    <p>Rs.{loginCustomerInfo.accountBalance}</p>
                </div>
                <div className={styles.transactionButton}>
                    <Button onClick={()=> setShowTransaction(true)} variant="outlined">View Transaction</Button>
                    <Button onClick={()=> setShowTransaction(false)} variant="outlined">Hide Transaction</Button>
                </div>
            </div>
            }

            {(!transactionHistoryFound && showTransaction) && 
            <div className={styles.noTransactionHistory}>
                <p>No Transaction Found</p>
            </div>
            }

            {(transactionHistoryFound && showTransaction) && 
            <div className={styles.transactionHistory}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={tableHeadingStyle}>Transaction Date Time</TableCell>
                                <TableCell sx={tableHeadingStyle}>Transaction Type</TableCell>
                                <TableCell sx={tableHeadingStyle}>Transaction Amount</TableCell>
                                <TableCell sx={tableHeadingStyle}>Updated Account Balance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactionHistory.map(function(eachTransaction){
                                return (
                                    <TableRow>
                                        <TableCell>{utcTimeToISTConvesion(eachTransaction.transactionDateTime.toString())}</TableCell>
                                        <TableCell>{eachTransaction.transactionType}</TableCell>
                                        <TableCell>{eachTransaction.transactionAmount}</TableCell>
                                        <TableCell>{eachTransaction.updatedAccountBalance}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            }
            
        </div>
    );
}