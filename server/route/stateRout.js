const express = require("express");
const router = express.Router();
const state=require('../modal/state');
const con=require('../modal/country')

router.post('/add_state',async(req,res)=>{
   
    const newState=new state({
        state_name:req.body.name,
        state_capital:req.body.capital,
        Country_id:req.body.id
    });
   await newState.save() 
   res.send({"msg":"State added sucsussfully"})
});

router.post('/get_state', async (req, res) => {
    try {
        const states = await state.find({});

        const list = [];
        for (const stateDoc of states) {
            const countryDoc = await con.findById(stateDoc.Country_id);
            const country_name = countryDoc ? countryDoc.country_name : '';
            const country_capital = countryDoc ? countryDoc.country_capital : '';
            const country_id = countryDoc ? countryDoc._id : '';

            list.push({
                _id: stateDoc._id,
                country_id: country_id,
                state_name: stateDoc.state_name,
                state_capital: stateDoc.state_capital,
                country_name: country_name,
                country_capital: country_capital
            });
        }

        res.json({ list });
    } catch (error) {
        console.error("Error fetching states:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;