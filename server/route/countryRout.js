const express = require("express");
const router = express.Router();
const country=require('../modal/country');

router.post('/add_country',async(req,res)=>{
   
    const newCountry=new country({
        country_name:req.body.name,
        country_capital:req.body.capital
    });
   await newCountry.save() 
   res.send({"msg":"County added sucsussfully"})
});

router.post('/get_country',async(req,res)=>{
   
    const newCountry= await country.find({});
   
    res.send(newCountry);
});

module.exports = router;
