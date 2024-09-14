import mongoose from "mongoose";

const Schema = mongoose.Schema;

const hotelCustomersTransactionSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'HotelCustomersUsers'
    }, 
    transactionAmount: {
        type: Number,
        required: true
    },
    transactionType: {
        type: String,
        required: true
    },
    transactionDescription: {
        type: String,
        required: true
    },
    transactionDateTime: {
        type: Date,
        required: true
    },
    updatedAccountBalance: {
        type: Number,
        required: true
    }
});

const HotelCustomersTransaction = mongoose.models.HOTELCUSTOMERSTRANSACTION || mongoose.model('HOTELCUSTOMERSTRANSACTION', hotelCustomersTransactionSchema);

export default HotelCustomersTransaction;