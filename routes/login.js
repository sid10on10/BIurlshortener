var express = require('express');
const { url,mongodClient } = require('../config');
var router = express.Router();
var bcryptjs = require("bcryptjs")
var jwt = require("jsonwebtoken")


router.post('/',async function(req,res,next){
    let client;
    try {
        client = await mongodClient.connect(url)
        let db = client.db("shortener")
        let {email, password} = req.body
        let user = await db.collection("users").findOne({email})
        //console.log(user)
        if(user){
            let result = await bcryptjs.compare(password,user.password)
            if(result){
                let token = jwt.sign({id:user._id},"qwertyuiop")
                res.json({
                    message:"Login Successfull Token Generated",
                    token
                })
                client.close()
            }else{
                res.json({
                    message:"Password Incorrect"
                })
                client.close()
            }
        }else{
            res.json({
                message:"No user found for this email"
            })
            client.close()
        }


    } catch (error) {
        client.close()
        console.log(error)
    }
})

module.exports = router;
