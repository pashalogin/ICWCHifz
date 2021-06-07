const express = require('express');
const faker = require('faker');
const moment = require('moment');
const randomString = require('randomstring');
const {
    ensureAuthenticated,
    isAdmin,
    isLoggedIn,
    createAccessControl,
    readAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../helpers/auth');

const {
    MarksAndGrades,
    validate
} = require('../models/marks-and-grades');

const {
    Student
} = require('../models/student');

const router = express.Router();

router.get('/', [ensureAuthenticated, readAccessControl], async (req, res) => {
    const perPage = 7;
    const page = req.query.page || 1;
    const skip = ((perPage * page) - perPage) + 1;
    const sort = req.query.sort || "asc";

    const marksAndGrade = await MarksAndGrades.find()
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({
            Session: sort
        });

    if (marksAndGrade.length > 0) {
        const pages = await MarksAndGrades.countDocuments();

        res.render('marks-and-grades/index', {
            title: 'MarksAndGrades',
            breadcrumbs: true,
            mg_search_bar: true,
            search_bar: false,
            marksAndGrades: marksAndGrade,
            current: parseInt(page),
            pages: Math.ceil(pages / perPage),
            total: pages,
            perPage: perPage,
            skip: skip,
            to: (marksAndGrade.length + 10)
        });
    } else {
        res.render('marks-and-grades/index', {
            title: 'MarksAndGrades',
            breadcrumbs: true,
            mg_search_bar: true,
            search_bar: false
        });
    }
});

router.get('/details', [ensureAuthenticated, readAccessControl], async (req, res) => {
});

// Search Marks And Grades.
router.post('/', [ensureAuthenticated, isAdmin], async (req, res) => {
    let key = req.body.searchInput;

    const marksAndGrades = await MarksAndGrades.find({
        'Name': key
    });

    if (marksAndGrades.length > 0) {
        res.render('marks-and-grades/index', {
            title: 'Marks And Grades',
            breadcrumbs: true,
            mg_search_bar: true,
            search_bar: false,
            marksAndGrades: marksAndGrades
        });
    } else {
        req.flash('error_msg', 'Record not found.');
        res.redirect('/marks-and-grades');
    }
});

router.post('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res) => {
    console.log("Entered Post /add")

    console.log(req.body);

    const student = await Student.find()

    let errors = [];

    const {
        error
    } = validate(req.body);

    console.log("error::"+error);

    if (error) {
        errors.push({
            text: error.details[0].message
        });
        res.render('marks-and-grades/add', {
            title: 'Add New Grades',
            breadcrumbs: true,
            student: student,
            errors: errors,
            body: req.body
        });
    } else {
        console.log("Entered in else block");
        const marksAndGrades = new MarksAndGrades({
            Name: req.body.Name,
            DateOfWork: req.body.DateOfWork,
            QuranNewLesson: req.body.QuranNewLesson, 
            AyahQuranNewLesson: req.body.AyahQuranNewLesson,
            QuranNewGrade: req.body.QuranNewGrade,
            HomeWork: req.body.HomeWork,
            AyahHomeWork: req.body.AyahHomeWork,
            ReviewLesson: req.body.ReviewLesson,
            AyahReviewLesson: req.body.AyahReviewLesson,
            ReviewGrade: req.body.ReviewGrade,
            Comments: req.body.Comments
        });
        try {
            console.log(marksAndGrades);
            const result = await marksAndGrades.save();

            console.log(result);

            if (result) {
                req.flash('success_msg', 'Information saved successfully.');
                res.redirect('/marks-and-grades');
            }
        } catch (ex) {
            for (field in ex.errors) {
                errors.push({
                    text: ex.errors[field].message
                });
                console.log(ex.errors[field]);
            }
            res.render('marks-and-grades/add', {
                title: 'Add New Grades',
                breadcrumbs: true,
                errors: errors,
                body: req.body
            });
        }

    }
});

router.get('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res) => {
    const student = await Student.find()
    // console.log(student);
    res.render('marks-and-grades/add', {
        title: 'Add New Grades',
        breadcrumbs: true,
        student: student
    });
   
});

router.get('/edit', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res) => {
    // const student = await Student.findOne({
    //     _id: req.query.id
    // });
    const student = await Student.find()

    console.log(req.query.id)
    const marksAndGrade = await MarksAndGrades.findOne({
        _id: req.query.id
    });
    // console.log(marksAndGrade);

  //  const dept = await Department.find();

 //   if (student && dept) {
        res.render('marks-and-grades/edit', {
            title: 'Edit Marks And Grades',
            breadcrumbs: true,
            student: student,
            marksAndGrades: marksAndGrade
         //   dept: dept
        });
 //   }
});


router.put('/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res) => {
    const {
        error
    } = validate(req.body);

    if (error) {
        req.flash('error_msg', error.details[0].message);
        res.redirect(`/marks-and-grades/edit?id=${req.params.id}`);
    } else {
        const marksAndGrades = await MarksAndGrades.update({
            _id: req.params.id
        }, {
            $set: {
                Name: req.body.Name,
                DateOfWork: req.body.DateOfWork,
                QuranNewLesson: req.body.QuranNewLesson,
                QuranNewGrade: req.body.QuranNewGrade,
                HomeWork: req.body.HomeWork,
                ReviewLesson: req.body.ReviewLesson,
                ReviewGrade: req.body.ReviewGrade,
                Comments: req.body.Comments
            }
        });

        if (marksAndGrades) {
            req.flash('success_msg', 'Marks And Grades Updated Successfully.');
            res.redirect('/marks-and-grades');
        }
    }
});

router.delete('/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res) => {
    const result = await MarksAndGrades.remove({
        _id: req.params.id
    });

    if (result) {
        req.flash('success_msg', 'Record deleted successfully.');
        res.send('/marks-and-grades');
    } else {
        res.status(500).send();
    }
});

router.delete('/multiple/:id', async (req, res) => {
    let str = req.params.id;

    for (i in str) {
        console.log(i);
    }

    const result = await MarksAndGrades.find({
        _id: {
            $in: []
        }
    });
    console.log(result);
    if (result) {
        req.flash('success_msg', 'Records deleted successfully.');
        res.send('/marks-and-grades');
    } else {
        res.status(500).send();
    }

    //let str = '[' + req.params.id + ']';
    //console.log(str);
});

router.delete('/details/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res) => {
    const result = await MarksAndGrades.remove({
        _id: req.params.id
    });

    if (result) {
        req.flash('success_msg', 'Record deleted successfully.');
        res.redirect('/marks-and-grades');
    }
});


module.exports = router;