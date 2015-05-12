var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.post('/send', function(req, res, next) {
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'your_email_here@gmail.com',
			pass: 'user_password'
		}
	});

	var mailOptions = {
		from: 'Express Site: ' + req.body.name + ' <' + req.body.email + '>',
		to: 'your_email_here@gmail.com',
		subject: 'Express Site Contact Form',
		text: 'You have a new contact form submission with the following details...Name: ' + req.body.name + ' Email: ' + req.body.email + ' Message: ' + req.body.message,
		html: 	'<p>You have a new contact form submission with the following details:</p><ul><li>Name: ' + req.body.name + '</li><li>Email: ' + req.body.email + '</li><li>Message: ' + req.body.message + '</li></ul>'
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error) {
			console.log(error);
			res.redirect('/');
		} else {
			console.log('Message Sent: ' + info.response);
			res.redirect('/');
		}
	});
});

module.exports = router;
