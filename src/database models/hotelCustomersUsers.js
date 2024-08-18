import mongoose from "mongoose";

const Schema = mongoose.Schema;

const hotelCustomersUsersSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    contactNo: {
        type: Number,
        required: true,
    },
    alternateContactNo: {
        type: Number,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    accountBalance: {
        type: Number,
        required: true
    }
});

const HotelCustomersUsers = mongoose.models.HOTELCUSTOMERSUSERS || mongoose.model('HOTELCUSTOMERSUSERS', hotelCustomersUsersSchema);

export default HotelCustomersUsers;