import express from 'express';
require('dotenv').config();
var moment = require('moment');
var app = express();
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongodbUrl = process.env.MONGODB_URI;
var db;

MongoClient.connect(mongodbUrl, (err, database) => {
    if (err) {
        return console.log(err);
    }
    db = database;
    app.listen(3000, () => {
        console.log('listening on 3000')
    });
})

router.get('/qotd', function(req, res) {
    var problems;
    var problemSets = db.collection('problemSets');
    problemSets.find({
        "date": moment().format('M/D/YY')
    }).toArray(function(err, docs) {
        if (docs) {
            var response = {
                problems: docs[0]['problems']
            };
            res.json(response);
        }
    });
});

app.use('/', express.static('src/public'));
app.use('/', router);

app.listen(process.env.PORT || 3001);






