const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true,
    },
    feeType: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paidAmount: {
        type: Number,
        default: 0,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    paidDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Partial'],
        default: 'Pending',
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    remarks: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model("fee", feeSchema);
