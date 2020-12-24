var express = require('express');
const { ObjectID } = require('mongodb');
var router = express.Router();
const { url,mongodClient } = require('../config');

router.get('/:shorturl',async function(req,res,){
    let client;
    try {
        client = await mongodClient.connect(url)
        let db = client.db("shortener")
        let short = req.params.shorturl
        let data = await db.collection("urls").findOne({short})
        let longurl = data.longURL
        await db.collection("urls").findOneAndUpdate({short},{$inc:{count:1}})
        res.redirect(longurl)
    } catch (error) {
        client.close()
        console.log(error)
    }
})



module.exports = router;