const express = require("express");
const router = express.Router();
const user = require('../modal/user');
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../static");
const auth = require('../middleware/auth');
const mongoose = require('mongoose')
const fs = require('fs');
const path = require('path');

const multer = require("multer");



router.post('/add_user', async (req, res) => {

    const newUser = new user({
        email: req.body.email,
        password: req.body.password,
        dob: req.body.dob,
        address: req.body.addr,
        name:req.body.name
    });
    await newUser.save()
    res.send({ "msg": "added sucsessfully" });

});

router.get('/getusers',async(req,res)=>{
    const newUser=await user.find({},{name:1});
    res.send(newUser)
})

router.post('/get_user', async (req, res) => {
    const newUser = await user.find({ email: req.body.email, password: req.body.password });
    console.log(newUser)

    if (newUser.length === 0) {
        return res.status(400).json({
            errors: [{ msg: "invalid username or password" }],
        });
    }


    //Create Payload
    const payload = {
        id: newUser[0]._id
    };

    console.log("payload..................", payload)

    jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: "8h" },
        (err, token) => {
            if (err) {
                throw err;
            }

            res.json({ token: token });
        }
    );

});

router.post('/load_user', auth, async (req, res) => {
    const newUser = await user.find({ _id: req.id });
    res.send(newUser)

})

router.post('/change_user', async (req, res) => {

    console.log(req.body)
    await user.updateOne({ _id: req.body.id }, { $set: { name: req.body.name, email: req.body.email } })
    const x = {
        "msg": "updated successfully"
    }
    res.send(x)

});

router.post('/delete_user', async (req, res) => {

    await user.deleteOne({ _id: req.body.id })
    res.send({ "msg": "deleted sucsessfully" });
})



module.exports = router;