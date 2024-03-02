const express = require("express");
const router = express.Router();
const name=require('../modal/name');
const  mongoose  = require("mongoose");


router.post('/add_name',async(req,res)=>{
   
    const newUser=new name({
        name:req.body.name,
    });
   await newUser.save() 
   console.log(newUser)
});

router.post('/get_name',async(req,res)=>{
   
    const newUser= await name.find({}); 
    res.send(newUser);
});

router.post('/del_name',async(req,res)=>{
    try{
   await name.deleteOne({ _id:req.body.id })

    } catch(er){
        console.log(er)
    }
})


module.exports = router;