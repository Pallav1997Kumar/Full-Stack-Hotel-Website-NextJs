import styles from './EventMeetingBookingInfo.module.css';

import EachEventMeetingBookingInfo from "./EachEventMeetingBookingInfo.jsx";


function EventMeetingBookingInfo(props){

    const allEventMeetingBookingInfo = props.allEventMeetingBookingInfo;

    return (
        <div className={styles.eventMeetingBookingInfoContainer}>
            {(allEventMeetingBookingInfo.length > 0) && allEventMeetingBookingInfo.map(function(eachEventMeetingBookingInfo){
                return (
                    <EachEventMeetingBookingInfo eachEventMeetingBookingInfo={eachEventMeetingBookingInfo.cartInfo} />
                )
            })}
        </div>
    );
}

export default EventMeetingBookingInfo;