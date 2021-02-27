var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var nodemailer = require('nodemailer');
var ejs = require('ejs');
var template = './views/mailtemplate.ejs';
var PORT = 3000;

var app = express();

var usersModel = require('./usermodel');
const moongoseUtils = require('./moongoseUtils');
var props = require('./mailconfig');

let transport = nodemailer.createTransport({
    host: props.host,
    port: props.port,
    secure: true,
    auth: {
        user: props.username,
        pass: props.password
    }
});

let mailOpts = {
    from: props.fromMailAddress,
    to: '',
    subject: 'Registration Success Mail',
    html: ''
};

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.post('/register', async function (request, response) {
    let reqData = request.body;

    reqData.createdOn = new Date();

    let addUser = new usersModel(reqData);

    await addUser.save().then(function (data) {
        if (data) {
            ejs.renderFile(template, { username: data.userName }, function (error, html) {
                if (error) {
                    response.json({
                        data: error,
                        message: 'Error while loading Template',
                    });
                } else {
                    mailOpts['to'] = data.emailId;
                    mailOpts['html'] = html;

                    transport.sendMail(mailOpts, function (err, info) {
                        if (err) {
                            response.json({
                                data: err,
                                message: 'Error while Sending Mail',
                            });
                        } else {
                            response.json({
                                meaage: 'User registration commpleted please check your mail'}
                            );
                        }
                    });
                }
            });
        }
    }).catch(function (error) {
        const errorMessage = moongoseUtils.mongooseErrorHandler(error, reqData.userName);
        response.json({
            error: errorMessage,
        });
    })
});

app.listen(PORT);
console.log(`Server listening in port ${PORT}`);