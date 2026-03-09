const Complain = require('../models/complainSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');

const complainCreate = async (req, res) => {
    try {
        const { user, date, complaint, school, userType } = req.body;

        // If school is provided, use it directly; otherwise look it up from user record
        let schoolId = school;
        let detectedUserType = userType;

        if (!schoolId) {
            // Try to find the user as a teacher first, then as a student
            let userRecord = await Teacher.findById(user);
            if (userRecord) {
                schoolId = userRecord.school;
                detectedUserType = 'teacher';
            } else {
                userRecord = await Student.findById(user);
                if (userRecord) {
                    schoolId = userRecord.school;
                    detectedUserType = 'student';
                }
            }

            if (!schoolId) {
                return res.status(400).json({ message: "Could not determine school for this user" });
            }
        }

        const complain = new Complain({
            user,
            userType: detectedUserType || 'student',
            date,
            complaint,
            school: schoolId,
        });
        const result = await complain.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const complainList = async (req, res) => {
    try {
        let complains = await Complain.find({ school: req.params.id });
        if (complains.length > 0) {
            // Manually populate user names from the correct collection
            const populatedComplains = await Promise.all(
                complains.map(async (complain) => {
                    const complainObj = complain.toObject();
                    let userRecord;
                    if (complain.userType === 'teacher') {
                        userRecord = await Teacher.findById(complain.user).select('name');
                    } else {
                        userRecord = await Student.findById(complain.user).select('name');
                    }
                    complainObj.user = userRecord || { name: 'Unknown User' };
                    return complainObj;
                })
            );
            res.send(populatedComplains);
        } else {
            res.send({ message: "No complains found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateComplain = async (req, res) => {
    try {
        const result = await Complain.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (result) {
            res.send(result);
        } else {
            res.send({ message: "Complaint not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { complainCreate, complainList, updateComplain };
