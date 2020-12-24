var express = require('express');
const { url,mongodClient } = require('../config');
var router = express.Router();
var bcryptjs = require("bcryptjs")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.write("<h1>Hello you are at registration end point</h1>")
  res.end()
});

router.post('/',async function(req,res,next){
    let client;
    try {
        client = await mongodClient.connect(url)
        let db = client.db("shortener")
        let {email, password} = req.body
        let user = await db.collection("users").findOne({email:email});
        if(user){
            res.json({message:"User Already Exist kindly login"})
        }else{
            let salt = await bcryptjs.genSalt(10)
            let hash = await bcryptjs.hash(password,salt)
            password = hash
            await db.collection("users").insertOne({
                email,
                password
            })
            res.json({
                message:"Registration Successfull You can now login"
            })
        }


    } catch (error) {
        client.close()
        console.log(error)
    }
})

module.exports = router;
