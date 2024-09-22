import styles from './RoomSuitesBookingInfo.module.css';

import EachRoomBookingInfo from "./EachRoomBookingInfo.jsx";

function RoomSuitesBookingInfo(props){

    const allRoomSuiteBookingInfo = props.allRoomSuiteBookingInfo;

    return (
        <div className={styles.roomSuiteBookingInfoContainer}>
            {(allRoomSuiteBookingInfo.length > 0) && allRoomSuiteBookingInfo.map(function(eachRoomBookingInfo){
                return(
                    <EachRoomBookingInfo eachRoomBookingInfo={eachRoomBookingInfo.cartInfo} />
                )
            })}
        </div>
    );

}

export default RoomSuitesBookingInfo;