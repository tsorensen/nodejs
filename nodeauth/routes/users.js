var express = require('express');
var router = express.Router();

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
		var new_user = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			profile_image: image_name
		});

		//create user
		User.createUser(new_user, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		//success message
		req.flash('success', 'You are now registered and may login');
		res.location('/');
		res.redirect('/');
	}

});

module.exports = router;
