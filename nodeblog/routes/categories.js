var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next) {
	res.render('addcategory', {
		"title": "Add Category"
	});
});

router.post('/add', function(req, res, next){
	// get form values from addcategory
	var title 		= req.body.title;

	//form validation
	req.checkBody('title', 'Title field is required').notEmpty();

	//check errors
	var errors = req.validationErrors();

	if(errors) {
		res.render('addcategory', {
			'errors': errors,
			'title': title
		});
	} else {
		var categories = db.get('categories');

		//submit to db
		categories.insert({
			"title": title
		}, function(err, category){
			if(err) {
				res.send('There was a problem submitting the category');
			} else {
				req.flash('success', 'Category Submitted Successfully')
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;
