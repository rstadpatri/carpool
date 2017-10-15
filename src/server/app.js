const express = require('express');
const app = express();

app.get('/', function(req, res) {
    res.send('Hello world!');
});

app.post('/driverOnline', function(req, res) {
        //#TODO//
});

app.listen(80, function()   {
    console.log('We\'re in business.');
})
