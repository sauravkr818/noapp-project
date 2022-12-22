const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var multer = require('multer');
var csv = require('csvtojson');
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/signupValidation");
const validateLoginInput = require("../../validation/loginValidation");
//const validatePaymentInput = require("../../validation/payment");
//const completePayment = require("../../payment/payment");
// Load User model
const User = require("../../models/user");
var csvUser = require('../../models/csv');
//const Member = require("../../models/member");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);


const upload = multer();

router.post("/dashboard", (req, res) => {
    console.log(req.body.email);
    // Form validation
    // const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    // if (!isValid) {
    //     return res.status(400).json(errors);
    // }
    // console.log('here1');
    csvUser.findOne({ email: req.body.email }).then((user) => {
            res.status(200).json(user);
    });
});

router.post("/signup", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    console.log('here1');
    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            return res.status(400).json({ err: "Email already exists" });
        } else {
            const newUser = new User({
                email: req.body.email,
                password: req.body.password,
            });

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then((user) => {
                            console.log(user);
                            return res.json(user);
                        })
                        .catch((err) => console.log(err));
                });
            });
        }
    });
});

router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then((user) => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ err: "Email/Password is wrong" });
        }

        // completePayment function

        // Check password
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    email: user.email,
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926, // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token,
                        });
                    }
                );
            } else {
                return res.status(400).json({ err: "Email/Password is wrong" });
            }
        });
    });
});


router.post('/dashboard', (req, res, next) => {
    console.log(req.body);
    csv()
    .fromFile(`./routes/api/${req.body.file[0].path}`)
    .then((jsonObj)=>{
        console.log(jsonObj); 
        var army = [];
        for(var i = 0;i<jsonObj.length;i++){
            var obj={};
            obj.name=jsonObj[i]['name'];
            obj.email=jsonObj[i]['email'];
            obj.phone=jsonObj[i]['phone'];
            obj.linkedin=jsonObj[i]['linkedin'];
            army.push(obj);
            console.log(army);
        }
        csvUser.insertMany(army).then(function(){
            res.status(200).send({
                message: "Successfully Uploaded!"
            });
        }).catch(function(error){
            res.status(500).send({
                message: "failure",
                error
            });
        });
    }).catch((error) => {
        res.status(500).send({
            message: "failure",
            error
        });
    })
});


module.exports = router;
