const express = require("express");
const router = express.Router();
const st=require('../modal/state');
const cy=require('../modal/city');
const con =require("../modal/country")

router.post('/add_city',async(req,res)=>{
   
    const newCity=new city({
        city_name:req.body.name,
        state_id:req.body.id
    });
   await newCity.save() 
   res.send({"msg":"City added sucsussfully"})
});

router.post('/get_city', async (req, res) => {
    try {
        const cities = await cy.find({});

        const list = [];
        for (const cityDoc of cities) {
            const stateDoc = await st.findById(cityDoc.state_id);
            const state_name = stateDoc ? stateDoc.state_name : '';
            const state_capital = stateDoc ? stateDoc.state_capital : '';
            const state_id = stateDoc ? stateDoc._id : '';
            const conDoc=await con.findById(stateDoc.Country_id);
            const country_name = conDoc ? conDoc.country_name : '';
            const country_capital = conDoc ? conDoc.country_capital : '';
            const country_id = conDoc ? conDoc._id : '';

            list.push({
                _id: cityDoc._id,
                country_id: country_id,
                state_name: state_name,
                state_capital:state_capital,
                country_name: country_name,
                country_capital: country_capital,
                city_name:cityDoc.city_name,
                state_id:state_id
            });
        }
        console.log(list)
        res.json({ list });
    } catch (error) {
        console.error("Error fetching states:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;