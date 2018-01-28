const express = require('express');
const logger = require('morgan');
const errorhandler = require('errorhandler');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

let app = express();
app.use(logger('dev'));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/edx-course-db');

const Account = mongoose.model('Account',
    {
        name: String,
        balance: Number
    }
);

app.get('/accounts', function (req, res) {
    Account.find({}, function (err, accounts) {
        res.send(accounts);
    });
});

app.post('/accounts', (req, res) => {
    let newAccount = new Account(req.body);

    newAccount.save((err, results) => {
        if (err) {
            process.exit(1)
        } else {
            process.exit(0)
        }
    });

    res.send(newAccount);
});

app.put('/accounts/:id', (req, res) => {    
    Account.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, account) {
        if (err) return handleError(err);
        res.send(account);
    });
});

app.delete('/accounts/:id', (req, res) => {    
    Account.findByIdAndRemove(req.params.id, function (err, account) {
        if (err) return handleError(err);
        res.send(account);
    });
});

app.use(errorhandler());
app.listen(3000);



