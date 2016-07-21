import express from 'express';

var app = express();
var router = express.Router();

router.get('/qotd', function(req, res) {
    var response = {
        problems: [{
            question: "The sound level of the chirping made by a bird at a distance of 5 meters is measured at 30 dB. When the same bird is 50 meters away the sound level is measured at 10 dB. How many times greater is the amplitude of the sound wave at 5 meters away compared to 50 meters away?",
            choices: {
                a: "3 times greater",
                b: "10 times greater",
                c: "20 times greater",
                d: "100 times greater"
            },
            answer: "b",
            explanation: "B is correct. Intensity level is related to intensity by a logarithmic scale: intensity level equals ten times the log of intensity. Therefore, an increase of 20 dB equals a 100-fold increase in intensity. Also, intensity is proportional to the square of amplitude, so a 100-fold increase in intensity is due to a 10-fold increase in amplitude."
        }]
    }
    res.json(response);
});

app.use('/', express.static('src/public'));
app.use('/', router);

app.listen(process.env.PORT || 3000);






