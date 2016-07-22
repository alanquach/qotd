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
        console.log('listening on 3000');
    });
})

router.get('/qotd', function(req, res) {
    var defaultProblems = [
        {
            "question": "The sound level of the chirping made by a bird at a distance of 5 meters is measured at 30 dB. When the same bird is 50 meters away the sound level is measured at 10 dB. How many times greater is the amplitude of the sound wave at 5 meters away compared to 50 meters away?",
            "choices": {
                "a": "3 times greater",
                "b": "10 times greater",
                "c": "20 times greater",
                "d": "100 times greater"
            },
            "answer": "b",
            "explanation": "B is correct. Intensity level is related to intensity by a logarithmic scale: intensity level equals ten times the log of intensity. Therefore, an increase of 20 dB equals a 100-fold increase in intensity. Also, intensity is proportional to the square of amplitude, so a 100-fold increase in intensity is due to a 10-fold increase in amplitude."
        },
        {
            "question": "A particle possessing a charge of +2 C and a mass of 1 g is exposed to an electric field with strength 5 N/C. How far will the particle move in 10 s?",
            "choices": {
                "a": "1 x 10^3 m",
                "b": "2 x 10^5 m",
                "c": "5 x 10^5 m",
                "d": "1 x 10^6 m"
            },
            "answer": "c",
            "explanation": "C is correct. The electric force exerted on the particle is equal to the product of field (force per unit charge) and charge. F = (5 N/C)(2 C) = 10 N. use F = ma, a = F/m = (10 N)/(1 g) = (10 N)/(10^-3 kg) = 10^4 m/s^2\\). Distance traveled, x, equals 0.5*a*t^2.Therefore, x=0.5*t*(10^4 m/s^2)(10s)^2 = 0.5x 10^6 m = 5x10^5 m."
        }
    ];


    var problems;
    var problemSets = db.collection('problemSets');
    var date = req.query.date;
    if (!date) {
        date = moment().format('M-D-YY');
    }
    problemSets.find({
        "date": date
    }).toArray(function(err, docs) {
        var response;
        if (docs && docs[0]) {
            response = {
                problems: docs[0]['problems']
            }
        } else {
            response = {
                problems: defaultProblems
            }
        }
        res.json(response);
    });
});

app.use('/', express.static('src/public'));
app.use('/', router);

app.listen(process.env.PORT || 3001);






