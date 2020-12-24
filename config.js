var mongodb = require("mongodb");
var mongodClient = mongodb.MongoClient;
//var url = "mongodb://127.0.0.1:27017"
var url = "mongodb+srv://siddhant:qwerty1234@cluster0.bkof1.mongodb.net/shortener?retryWrites=true&w=majority"

module.exports = {url, mongodClient}