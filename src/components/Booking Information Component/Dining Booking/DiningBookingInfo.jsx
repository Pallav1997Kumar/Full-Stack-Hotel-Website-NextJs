import styles from './DiningBookingInfo.module.css';

import EachDiningBookingInfo from "./EachDiningBookingInfo.jsx";


function DiningBookingInfo(props){

    const allDiningBookingInfo = props.allDiningBookingInfo;


    return (
        <div className={styles.diningBookingInfoContainer}>
            {(allDiningBookingInfo.length > 0) && allDiningBookingInfo.map(function(eachDiningBookingInfo){
                return (
                    <EachDiningBookingInfo eachDiningBookingInfo={eachDiningBookingInfo.cartInfo} />
                )
            })}
        </div>
    );

}

export default DiningBookingInfo;