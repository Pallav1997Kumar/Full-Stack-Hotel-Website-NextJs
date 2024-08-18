import React from 'react';
import Image from 'next/image';
import Link from 'next/link'
import Button from '@mui/material/Button';

import styles from "./EventsMeetingsEachRoom.module.css";

function EventsMeetingsEachRoom(props) {
    const currentMeetingEvent = props.currentMeetingEvent;
    const meetingEventAreaPath = currentMeetingEvent.meetingEventAreaPath;

    const unsortedMeetingEventAreaSeatingCapacityInfo = currentMeetingEvent.meetingEventAreaSeatingCapacityInfo;
    const onlyMeetingEventsSeatingInfoWhereSeatingPresent = unsortedMeetingEventAreaSeatingCapacityInfo.filter(function(eachSeatingArrangement){
        return (eachSeatingArrangement.meetingEventAreaSeatingCapacity != 'N/A');
    });
    const sortedMeetingEventAreaSeatingCapacityInfo = onlyMeetingEventsSeatingInfoWhereSeatingPresent.toSorted((a,b) => b.meetingEventAreaSeatingCapacity - a.meetingEventAreaSeatingCapacity);
    const maximumSeatingCapacity = sortedMeetingEventAreaSeatingCapacityInfo[0].meetingEventAreaSeatingCapacity;

    return (
        <div className={styles.eachCurrentMeetingEvent}>
            <div className={styles.currentMeetingEventImage}>
                <Image src={currentMeetingEvent.meetingEventAreaImage} alt="current-event-meeting" width={500} height={300} />
            </div>
            <div className={styles.currentMeetingEventInfo}>
                <h3>{currentMeetingEvent.meetingEventAreaTitle}</h3>
                <p className={styles.maximumSeatingCapacity}> Maximum Seating Capacity: {maximumSeatingCapacity} </p>
                <p className={styles.shortDescription}>{currentMeetingEvent.meetingEventAreaShortDescription}</p>
                <p className={styles.description}>{currentMeetingEvent.meetingEventAreaDescription}</p>
                <div className={styles.buttonContainer}>
                    <Link href={`/meetings-events/${meetingEventAreaPath}`}> 
                        <Button variant="contained">EXPLORE EVENT AND MEETING AREA</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
    
}

export default EventsMeetingsEachRoom;