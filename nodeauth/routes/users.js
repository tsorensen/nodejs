var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// users/register
router.get('/register', function(req, res, next) {
  res.render('register', {
  	'title': 'Register'
  });
});

// users/login
router.get('/login', function(req, res, next) {
  res.render('login', {
  	'title': 'Login'
  });
});

//handles register form data
router.post('/register', function(req, res, next){

	// get form values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	//check for image field
	if(req.files.profile_image) {
		console.log('Uploading file...');

		//file info
		var original_image_name = req.files.profile_image.originalname;
		var image_name = req.files.profile_image.name;
		var mime = req.files.profile_image.mimetype;
		var path = req.files.profile_image.path;
		var ext = req.files.profile_image.extension;
		var size = req.files.profile_image.size;
	} else {
		// set a default image
		var image_name = 'noimage.png';
	}

	//register form validation
	req.checkBody('name', 'Name is a required field').notEmpty();
	req.checkBody('email', 'Email is a required field').notEmpty();
	req.checkBody('email', 'Please enter a valid email address').isEmail();
	req.checkBody('username', 'Username is a required field').notEmpty();
	req.checkBody('password', 'Password is a required field').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	//check for errors
	var errors = req.validationErrors();
	if(errors) {
		res.render('register',{
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			profile_image: image_name
		});

		//create user
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		//success message
		req.flash('success', 'You are now registered and may login');
		res.location('/');
		res.redirect('/');
	}
});

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user) {
			if(err) throw err;
			if(!user) {
				console.log('Unknown User');
				return done(null, false, {message: 'Unknown User'});
			}

			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch) {
					return done(null, user);
				} else {
					console.log('Invalid Password');
					return done(null, false, {message: 'Invalid Password'});
				}
			});
		});
	}
));

router.post('/login', passport.authenticate('local',{failureRedirect:'/users/login', failureFlash:'Invalid username or password'}), function(req, res){
	console.log('Authentication Successful');
	req.flash('success', 'You are now logged in');
	res.redirect('/');
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You are now logged out');
	res.redirect('/users/login');
});

module.exports = router;
