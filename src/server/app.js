const express = require('express');
const app = express();
let i = 0;
app.get('/', function(req, res) {
    res.send('Hello world!');
});

app.listen(80, function()   {
    console.log('We\'re in business.');
})
