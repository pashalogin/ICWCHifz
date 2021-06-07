const Joi = require('joi');
const mongoose = require('mongoose');

const marksAndGradesSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    DateOfWork: {
        type: String,
        required: true
    },
    QuranNewLesson: {
        type: String,
        required: true
    },
    QuranNewGrade: {
        type: String,
        required: true
    },
    HomeWork: {
        type: String,
        required: true
    },
    ReviewLesson: {
        type: String,
        required: true
    },
    ReviewGrade: {
        type: String,
        required: true
    },
    Comments: {
        type: String,
        required: true
    },
    AyahQuranNewLesson: {
        type: String,
        required: true
    },
    AyahReviewLesson: {
        type: String,
        required: true
    },
    AyahHomeWork: {
        type: String,
        required: true
    }
});

const MarksAndGrades = mongoose.model('MarksAndGrades', marksAndGradesSchema);

function validateMarksAndGrades(marksAndGrades) {
    const schema = {
        Name: Joi.string().required(),
        DateOfWork: Joi.string().required(),
        QuranNewLesson: Joi.string().required(),
        QuranNewGrade: Joi.string().required(),
        HomeWork: Joi.string().required(),
        ReviewLesson: Joi.string().required(),
        ReviewGrade: Joi.string().required(),
        Comments: Joi.string().required(),
        AyahQuranNewLesson: Joi.string().required(),
        AyahReviewLesson: Joi.string().required(),
        AyahHomeWork: Joi.string().required(),
    };
    return Joi.validate(marksAndGrades, schema);
}

exports.MarksAndGrades = MarksAndGrades;
exports.validate = validateMarksAndGrades;