const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/predict', (req, res) => {
    const event = req.body.event;
    const gender = req.body.gender;
    const pr = parseFloat(req.body.pr);

    // Your prediction logic here
    const predictedMark = 69; // Example prediction

    res.send(`Your predicted mark for your Freshman year of college is: ${predictedMark}.`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
