const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${((seconds % 60) - remainingSeconds).toFixed(2).slice(2)}`;
}


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
    } else if (gender === 'male' && event === '1600m') {
        predictedMark =  0.627 * pr + 76.08;
    }else {
        return res.send("Coming soon!");
    }

    let responseMessage;
    if (event === '1600m') {
        responseMessage = `Your predicted mark for your Freshman year of college is: ${formatTime(predictedMark)}.`;
    } else {
        responseMessage = `Your predicted mark for your Freshman year of college is: ${predictedMark.toFixed(2)}.`;
    }

    res.send(responseMessage);
    
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
    } else if (gender === 'male' && event === '1600m') {
        filename = 'Mens1500mMatched.csv';
    }

    const results = [];
    fs.createReadStream(filename)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('error', (error) => {
            console.error(`Error reading or parsing file ${filename}:`, error);
            res.status(500).send('Server error');
        })
        .on('end', () => {
            res.json(results);
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});