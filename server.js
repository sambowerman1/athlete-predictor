const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/predict', (req, res) => {
    const event = req.body.event;
    const gender = req.body.gender;
    const pr = parseFloat(req.body.pr);

    let predictedMark;

    if (gender === 'male' && event === 'triplejump') {
        predictedMark = 3.5285 + 0.7627 * pr;
    } else if (gender === 'male' && event === 'longjump') {
        predictedMark = 0.618 * pr + 2.630;
    } else if (gender === 'female' && event === 'triplejump') {
        predictedMark = 0.699 * pr + 3.458;
    } else if (gender === 'female' && event === 'longjump') {
        predictedMark = 0.698 * pr + 1.611;
    } else {
        return res.send("Coming soon!");
    }

    res.send(`Your predicted mark for your Freshman year of college is: ${predictedMark.toFixed(2)}.`);
});

app.get('/jump-data', (req, res) => {
    const event = req.query.event;
    const gender = req.query.gender;
    let filename;

    if (gender === 'male' && event === 'triplejump') {
        filename = 'MensTripleMatchedJumpers.csv';
    } else if (gender === 'male' && event === 'longjump') {
        filename = 'MensLongMatchedJumpers.csv';
    } else if (gender === 'female' && event === 'triplejump') {
        filename = 'WomensTripleMatchedJumpers.csv';
    } else if (gender === 'female' && event === 'longjump') {
        filename = 'WomensLongMatchedJumpers.csv';
    }

    const results = [];
    fs.createReadStream(filename)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            res.json(results);
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
