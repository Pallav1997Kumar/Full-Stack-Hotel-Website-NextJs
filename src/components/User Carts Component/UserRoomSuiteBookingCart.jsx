'use client'
import React, { useState } from "react";

import styles from './UserRoomSuiteBookingCart.module.css';

import UserEachRoomCart from "./UserEachRoomCart.jsx";


function UserRoomSuiteBookingCart(props){

    const roomSuitesCart = props.roomSuitesCart;
    const [checkedId, setCheckedId] = useState([]);

    function onRemoveRoomsSuitesItemFromCart(id){
        props.onRemoveRoomsSuitesItemFromCart(id);
    }

    props.onGetCheckIdRoomsSuitesCart(checkedId);

    function getRoomsSuitesCheckboxInfo(event, id){
        const isChecked = event.target.checked;
        if(isChecked){
            setCheckedId(function(previousCheckedItems){
                return (
                    [...previousCheckedItems, id]
                );
            });
        }
        if(!isChecked){
            setCheckedId(checkedId.filter(function(eachId){
                return (eachId !== id);
            }))
        }
    }


    return (
        <div className={styles.roomCartContainer}>
            {(roomSuitesCart.length > 0) && roomSuitesCart.map(function(eachRoomInCart){
                const isRoomSuiteChecked = checkedId.includes(eachRoomInCart._id);
                return(
                    <UserEachRoomCart 
                        key={eachRoomInCart._id} 
                        isRoomSuiteChecked={isRoomSuiteChecked}
                        eachRoomInCart={eachRoomInCart} 
                        onRemoveRoomsSuitesItemFromCart={onRemoveRoomsSuitesItemFromCart}
                        onGetRoomsSuitesCheckboxInfo={getRoomsSuitesCheckboxInfo}
                    />
                )
            })}
        </div>
    );
}

export default UserRoomSuiteBookingCart;