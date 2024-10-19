import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tableBookingCountDetailsSchema  = new Schema({
    tableCountTwoPerson: {
        type: Number,
        required: true
    },
    tableCountFourPerson: {
        type: Number,
        required: true
    },
    tableCountSixPerson: {
        type: Number,
        required: true
    }
});

const diningBookingInfoSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'HotelCustomersUsers'
    },
    transactionId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'HotelCustomersTransaction'
    },
    diningRestaurantTitle: {
        type: String,
        required: true,
        enum: ['Cal 27', 'Sonargaon', 'Chinoiserie', 'Souk', 'The Junction', 'Grill By The Pool', 'The Promenade Lounge', 'La Patisserie And Deli', 'The Chambers'],
    },
    tableBookingDate: {
        type: Date,
        required: true
    },
    noOfGuests: {
        type: Number,
        required: true
    },
    mealType: {
        type: String,
        required: true,
        enum: ['breakfast', 'lunch', 'dinner', 'general']
    },
    tableBookingTime: {
        type: String,
        required: true
    },
    tableBookingCountDetails: tableBookingCountDetailsSchema,
    priceForBooking: {
        type: Number,
        required: true
    }
});

const DiningBookingInfo = mongoose.models.DININGBOOKINGINFO || mongoose.model('DININGBOOKINGINFO', diningBookingInfoSchema);

export default DiningBookingInfo;