var express = require('express');
const { ObjectID } = require('mongodb');
var router = express.Router();
const { url,mongodClient } = require('../config');
var jwt = require("jsonwebtoken")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// index route
router.post('/shorturl',async function(req,res,next){
  let client;
  try {
    client = await mongodClient.connect(url)
    let db = client.db("shortener")
    let token = req.headers.authorization
    let user = jwt.verify(token,"qwertyuiop")
    let userID = user.id
    let short = Math.random().toString(20).substr(2,6)
    let shortURL = `http://biurlshortener.herokuapp.com/short/${short}`
    let longURL = req.body.url
    await db.collection("urls").insertOne({
      short,shortURL,longURL,count:0
    })
    await db.collection("users").findOneAndUpdate({_id:ObjectID(userID)},{$push:{urls:short}}) // []
    res.json({
      message:"Short url created",
      shorturl:shortURL
    })

  } catch (error) {
    client.close()
    console.log(error)
  }
})

module.exports = router;
