global._ = require('lodash');
global.t = require('moment');
global.bodyParser = require('body-parser');
global.nodemailer = require('nodemailer');
var firebaseRef = require('./firebase-ref');



function run(appdir) {
    var express = require('express');
    var app = express();
    var needle = require('needle');

    app.dir = process.cwd();
    // things to do on each request
    app.use(function(req, res, next) {
        // tell the client what firebase to use
        if (process.env.NODE_ENV === 'production') {
            res.cookie('rootRef', firebaseRef.prod);
        } else {
            // development mode
            res.cookie('rootRef', firebaseRef.dev);
            // log the request
        }
        next();
    });
    // static files
    app.use(express.static(app.dir + '/public'));

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.post('/smarterer/code', function(req, res) {
        console.log(req.body);
        var code = req.body.code;
        needle.get('https://smarterer.com/oauth/access_token?client_id=b30a2803ffe34bc68a6fe7757b039468&client_secret=d3cdb9f2dd7e58f6a7d102be76cfff4d&grant_type=authorization_code&code=' + code, function(err, resp) {
            if (err) {
                res.send({
                    err: err
                });
            } else {
                // res.redirect('');
                //console.log(resp.body);
                needle.get('https://smarterer.com/api/badges?access_token=' + resp.body.access_token, function(error, response) {
                    if (error) {
                        res.send({
                            err: error
                        });
                    } else {
                        //console.log(response.body);
                        res.send(response.body);
                    }
                });
            }
        });
    });

    app.post('/plum/api', function(req, res) {
        var data = JSON.stringify({
            "candidates": [{
                "firstname": req.body.fname,
                "lastname": req.body.lname,
                "email": req.body.email
            }]
        });
        var options = {
            headers: {
                'apikey': 'a6b2743e-h1ec-4aTd-a4T0-fd61b4411456'
            }
        };
        needle.post('http://app.plum.io/api/v1/assessment', data, options, function(err, resp) {
            if (!err) {
                res.send(resp.body);
            } else {
                console.log('error', err);
            }

        });

    });

    app.post('/mail/user/:type', function(req, res) {
        var fellowName = req.body.firstName;
        var fellowMail = req.body.email;
        var mailMessage = req.body.message;
        var uid = req.body.uid;
        var type = req.params.type;
        var reason = req.body.reason;
        var adminMail = 'Andela ✔ <1testertest1@gmail.com>';
        var _res = req.body;
        _res.type = type;
        var user = req.body.user;

        // create reusable transporter object using SMTP transport
        var transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "1testertest1@gmail.com",
                pass: "p87654321"
            }
        });
        var mailOptions = {};
        if (type) {
            type = parseInt(type, 10);
            switch (type) {
                case 1:
                    mailOptions = {
                        from: adminMail,
                        to: fellowMail,
                        subject: 'Hello ' + fellowName,
                        html: 'You have a pending request to be mentored, the message says ' + reason + ', you can <a href=\'http://' + req.hostname + '/fellows/' + uid + '\'>View them here</a> <br> We hope you have a great time! <br> Team Matsi '
                    };
                    break;
                case 2:
                    mailOptions = {
                        from: adminMail,
                        to: fellowMail,
                        subject: 'Hello ' + fellowName,
                        html: "Your signup request has been recieved and is being processed, until approved<br>you won't be able to login, please be patient as approvals are done by real humans <br>Thank you for your offer of service <br> Team Matsi"
                    };
                    break;
                case 3:
                    mailOptions = {
                        from: adminMail,
                        to: fellowMail,
                        subject: 'Hello ' + fellowName,
                        html: 'Your mentor request has been accepted'
                    };
                    break;
                case 4:
                    mailOptions = {
                        from: adminMail,
                        to: fellowMail,
                        subject: 'Hello ' + fellowName,
                        html: 'Your mentor request has been rejected because ' + mailMessage
                    };
                    break;
                case 5:
                    mailOptions = {
                        from: adminMail,
                        to: fellowMail,
                        subject: 'Hello ✔' + fellowName,
                        html: 'Your account has been activated, You can now <a href=\'http://' + req.hostname + '\'>Login</a>'
                    };
                    break;
            }
        }
        // create email options
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(e, i) {
            if (e) {} else {}
        });
        res.status(200).send(_res);
    });
    app.get('/*', function(req, res) {
        res.sendFile('index.html', {
            root: './public/'
        });
    });

    // Standard error handling
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
    // Fire up server
    var server = app.listen(process.env.PORT || 5555, function() {
        console.log('Up Matsi Listening on port %d', server.address().port);
    });
}
run(process.cwd());
