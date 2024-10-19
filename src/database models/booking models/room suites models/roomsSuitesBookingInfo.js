import mongoose from "mongoose";

const Schema = mongoose.Schema;

const guestRoomDetailsSchema = new Schema({
    roomNo: {
        type: Number,
        required: true
    },
    noOfAdult: {
        type: Number,
        required: true
    },
    noOfChildren: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
});

const roomsSuitesBookingInfoSchema = new Schema({
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
    bookingRoomTitle: {
        type: String,
        required: true,
        enum: ['Deluxe Rooms', 'Luxury Rooms', 'Premier Rooms', 'Premier Plus Rooms', 'Oberoi Suites', 'Deluxe Suites', 'Luxury Suites', 'Kohinoor Suites']
    },
    bookingCheckinDate: {
        type: Date,
        required: true
    },
    bookingCheckoutDate: {
        type: Date,
        required: true
    },
    totalRooms: {
        type: Number,
        required: true
    },
    totalGuest: {
        type: Number,
        required: true
    },
    guestRoomsDetails: [guestRoomDetailsSchema],
    totalPriceOfAllRooms: {
        type: Number,
        required: true
    }
});

const RoomsSuitesBookingInfo = mongoose.models.ROOMSSUITESBOOKINGINFO || mongoose.model('ROOMSSUITESBOOKINGINFO', roomsSuitesBookingInfoSchema);

export default RoomsSuitesBookingInfo;