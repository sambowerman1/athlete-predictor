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
    } else if (gender === 'female' && event === '1600m') {
        predictedMark =  0.642 * pr + 88.96;
    } else if (gender == 'male' && event === '400m') {
        predictedMark = 0.713 * pr + 13.88;
    } else if (gender == 'female' && event === '400m') {
        predictedMark = 0.706 * pr + 17.40;
    } else if (gender == 'female' && event === '800m') {
        predictedMark = 0.646 * pr + 50.56;
    } else if (gender == 'male' && event === '800m') {
     // CollegePR = .0.4889   x PR +59.7126
        predictedMark = 0.4889 * pr + 59.7126;
    }    
    else {
        return res.send("Coming soon!");
    }

    let responseMessage;
    if (event === '1600m' || event === '800m') {
        // responseMessage = `Your predicted mark for your Freshman year of college is: ${formatTime(predictedMark)}.`;
        // responseMessage = `Your predicted mark for your Freshman year of college is: ${predictedMark.toFixed(2)}.`;
        responseMessage = {
            message: `Your predicted mark for your Freshman year of college is: ${formatTime(predictedMark)}.`,
            predictedMark: predictedMark.toFixed(2), // keep as seconds for charting
            formattedTime: formatTime(predictedMark) // formatted for display
        };
    } else {
        responseMessage = `Your predicted mark for your Freshman year of college is: ${predictedMark.toFixed(2)}.`;
    }

    // res.send(responseMessage);
    res.json(responseMessage);
    
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
    else if (gender === 'female' && event === '1600m') {
        filename = 'Womens1500mMatched.csv';
    } else if (gender === 'male' && event === '400m') {
        filename = 'Mens400mMatched.csv';
    } else if (gender == 'female' && event === '400m') {
        filename = 'Womens400mMatched.csv';
    } else if (gender == 'female' && event === '800m') {
        filename = 'Womens800mMatched.csv';
    } else if (gender == 'male' && event === '800m') {
        filename = 'Mens800mMatched.csv';
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

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/public/about.html'); 
});

app.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/public/contact.html'); 
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
