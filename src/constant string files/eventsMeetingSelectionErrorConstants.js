const singleDateEventsMeetingSelectionErrorConstants = {
    BOOKING_DATE_BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date, Event Booking Time and Event Seating Arrangement.',
    
    BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Time and Event Seating Arrangement',
    BOOKING_DATE_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date and Event Booking Time',
    BOOKING_DATE_BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date and Event Booking Time',

    BOOKING_DATE_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date',
    BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Time',
    SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Seating Arrangement',

    GUEST_NOT_LESS_THAN_ONE: 'Number of guest cannot be less than 1',
    GUEST_COUNT_GREATER_THAN_CAPACITY: 'You have entered Number of Guests greater than Seating Arrangement Capacity',
    SELECT_FOOD_ITEM: 'Please Select atleast one Food Item if you want Food Services!'
}


const multipleContinousDatesEventsMeetingSelectionErrorConstants = {
    GUEST_COUNT_GREATER_THAN_CAPACITY: 'You have entered Number of Guests greater than Seating Arrangement Capacity',
    GUEST_NOT_LESS_THAN_ONE: 'Number of guest cannot be less than 1',
    SELECT_FOOD_ITEM: 'Please Select atleast one Food Item if you want Food Services!',   

    BOOKING_START_DATE_BOOKING_END_DATE_BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Start Date, Event Booking End Date, Event Booking Time and Event Seating Arrangement',

    BOOKING_START_DATE_BOOKING_END_DATE_BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Start Date, Event Booking End Date and Event Booking Time',
    BOOKING_START_DATE_BOOKING_END_DATE_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Start Date, Event Booking End Date and Event Seating Arrangement',
    BOOKING_START_DATE_BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Start Date, Event Booking Time and Event Seating Arrangement',
    BOOKING_END_DATE_BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking End Date, Event Booking Time and Event Seating Arrangement',

    BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Time and Event Seating Arrangement',
    BOOKING_END_DATE_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking End Date and Event Seating Arrangement',
    BOOKING_END_DATE_BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking End Date and Event Booking Time',
    BOOKING_START_DATE_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Start Date and Event Seating Arrangement',
    BOOKING_START_DATE_BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Start Date and Event Booking Time',
    BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!! Event Booking Time and Event Seating Arrangement',

    BOOKING_START_DATE_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Start Date',
    BOOKING_END_DATE_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking End Date',
    BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Time',
    SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Seating Arrangement'
}


const multipleNonContinousDatesEventsMeetingSelectionErrorConstants = {
    GUEST_COUNT_GREATER_THAN_CAPACITY: 'You have entered Number of Guests greater than Seating Arrangement Capacity',
    SELECT_FOOD_ITEM: 'Please Select atleast one Food Item if you want Food Services!',
    GUEST_NOT_LESS_THAN_ONE: 'Number of guest cannot be less than 1',

    BOOKING_DATE_BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date, Event Booking Time and Event Seating Arrangement.',
    
    BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Time and Event Seating Arrangement',
    BOOKING_DATE_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date and Event Booking Time',
    BOOKING_DATE_BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date and Event Booking Time',

    BOOKING_DATE_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date',
    BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Time',
    SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Seating Arrangement',

    INPUT_NOT_LESS_THAN_TWO: 'Number of input cannot be less than 2',
    MULTIPLE_SAME_DATES_CHOOSEN: 'You have Choosen Two or More Same Dates',
    ALL_DATES_INPUT_NOT_CHOOSEN: 'You have not Choosen Inputs for all the Dates'
}

export { singleDateEventsMeetingSelectionErrorConstants, multipleContinousDatesEventsMeetingSelectionErrorConstants, multipleNonContinousDatesEventsMeetingSelectionErrorConstants };