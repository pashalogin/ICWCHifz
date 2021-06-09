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
    QuranNewLessonFrom: {
        type: String,
        required: false
    },
    QuranNewLessonTo: {
        type: String,
        required: false
    },
    QuranNewGrade: {
        type: String,
        required: false
    },
    HomeWorkFrom: {
        type: String,
        required: false
    },
    HomeWorkTo: {
        type: String,
        required: false
    },
    ReviewLessonFrom: {
        type: String,
        required: false
    },
    ReviewLessonTo: {
        type: String,
        required: false
    },
    ReviewGrade: {
        type: String,
        required: false
    },
    Comments: {
        type: String,
        required: false
    },
    AyahQuranNewLessonFrom: {
        type: String,
        required: false
    },
    AyahQuranNewLessonTo: {
        type: String,
        required: false
    },
    AyahReviewLessonFrom: {
        type: String,
        required: false
    },
    AyahReviewLessonTo: {
        type: String,
        required: false
    },
    AyahHomeWorkFrom: {
        type: String,
        required: false
    },
    AyahHomeWorkTo: {
        type: String,
        required: false
    }
});

const MarksAndGrades = mongoose.model('MarksAndGrades', marksAndGradesSchema);

function validateMarksAndGrades(marksAndGrades) {
    const schema = {
        Name: Joi.string().required(),
        DateOfWork: Joi.string().required(),
        QuranNewLessonFrom: Joi.string().required(),
        QuranNewLessonTo: Joi.string().required(),
        QuranNewGrade: Joi.string().required(),
        HomeWorkFrom: Joi.string().required(),
        ReviewLessonFrom: Joi.string().required(),
        HomeWorkTo: Joi.string().required(),
        ReviewLessonTo: Joi.string().required(),
        ReviewGrade: Joi.string().required(),
        Comments: Joi.string().required(),
        AyahQuranNewLessonFrom: Joi.string().required(),
        AyahQuranNewLessonTo: Joi.string().required(),
        AyahReviewLessonFrom: Joi.string().required(),
        AyahHomeWorkFrom: Joi.string().required(),
        AyahReviewLessonTo: Joi.string().required(),
        AyahHomeWorkTo: Joi.string().required(),
    };
    return true;
    // return Joi.validate(marksAndGrades, schema);
}

exports.MarksAndGrades = MarksAndGrades;
exports.validate = validateMarksAndGrades;