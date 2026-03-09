const Fee = require('../models/feeSchema.js');
const Student = require('../models/studentSchema.js');

const feeCreate = async (req, res) => {
    try {
        let schoolId = req.body.adminID;
        if (!schoolId) {
            const studentRecord = await Student.findById(req.body.student);
            if (studentRecord) {
                schoolId = studentRecord.school;
            }
        }

        if (!schoolId) {
            return res.status(400).json({ message: "Could not determine school ID" });
        }

        const fee = new Fee({
            ...req.body,
            school: schoolId
        });
        const result = await fee.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const feeList = async (req, res) => {
    try {
        let fees = await Fee.find({ school: req.params.id })
            .populate('student', 'name rollNum sclassName');
        if (fees.length > 0) {
            res.send(fees);
        } else {
            res.send({ message: "No fees found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getFeeDetail = async (req, res) => {
    try {
        let fee = await Fee.findById(req.params.id)
            .populate('student', 'name rollNum sclassName')
            .populate('school', 'schoolName');
        if (fee) {
            res.send(fee);
        } else {
            res.send({ message: "No fee record found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateFee = async (req, res) => {
    try {
        const result = await Fee.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true });
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteFee = async (req, res) => {
    try {
        const result = await Fee.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteFees = async (req, res) => {
    try {
        const result = await Fee.deleteMany({ school: req.params.id });
        if (result.deletedCount === 0) {
            res.send({ message: "No fees found to delete" });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

const getFeeSummary = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const summary = await Fee.aggregate([
            { $match: { school: new mongoose.Types.ObjectId(req.params.id) } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    totalPaid: { $sum: '$paidAmount' },
                    totalPending: {
                        $sum: {
                            $subtract: ['$amount', '$paidAmount']
                        }
                    },
                    totalRecords: { $sum: 1 },
                }
            }
        ]);

        if (summary.length > 0) {
            res.send(summary[0]);
        } else {
            res.send({ totalAmount: 0, totalPaid: 0, totalPending: 0, totalRecords: 0 });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { feeCreate, feeList, getFeeDetail, updateFee, deleteFee, deleteFees, getFeeSummary };
