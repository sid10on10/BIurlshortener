var express = require('express');
const { ObjectID } = require('mongodb');
var router = express.Router();
const { url,mongodClient } = require('../config');
const mongodb = require("mongodb")
const jwt = require("jsonwebtoken")


router.get('/data',async function(req,res){
    let client;
    try {
        client = await mongodClient.connect(url)
        let db = client.db("shortener")
        let token = req.headers.authorization
        let user = jwt.verify(token,"qwertyuiop")
        let userID = user.id
        let userData = await db.collection("users").findOne({_id:ObjectID(userID)})
        if(userData){
            let urls = userData.urls
            let outData = []
            if(urls!=undefined){
                for(each of urls){
                    if(each){
                        let eachURL = await db.collection("urls").findOne({short:each})
                        let longURL = eachURL.longURL
                        let shortURL = eachURL.shortURL
                        let count  = eachURL.count
                        outData.push({
                            longURL,shortURL,count
                        })
                    }else{
                        // pass 
                    }
                    
                }
            }else{
                res.json({
                    outData
                })
            }
            res.json({
                message:"User Urls data",
                outData
            })
        }
    } catch (error) {
        client.close()
        console.log(error)
    }
})

module.exports = router;