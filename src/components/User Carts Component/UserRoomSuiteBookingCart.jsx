import styles from './UserRoomSuiteBookingCart.module.css';

import UserEachRoomCart from "./UserEachRoomCart.jsx";

function UserRoomSuiteBookingCart(props){

    const roomSuitesCart = props.roomSuitesCart;

    function onRemoveRoomsSuitesItemFromCart(id){
        props.onRemoveRoomsSuitesItemFromCart(id);
    }

    return (
        <div className={styles.roomCartContainer}>
            {(roomSuitesCart.length > 0) && roomSuitesCart.map(function(eachRoomInCart){
                return(
                    <UserEachRoomCart 
                        key={eachRoomInCart._id} 
                        eachRoomInCart={eachRoomInCart} 
                        onRemoveRoomsSuitesItemFromCart={onRemoveRoomsSuitesItemFromCart}
                    />
                )
            })}
        </div>
    );
}

export default UserRoomSuiteBookingCart;