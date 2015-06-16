'use strict';

var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');

module.exports = function (router) {
    router.get('/books', function (req, res) {           
        Book.find({}, function(err, books){
        	if(err) {
        		console.log(err);
        	}

        	var model = {
        		books: books
        	};

        	res.render('manage/books/index', model);
        });     
    });


    router.get('/', function (req, res) {           
        res.render('manage/index');       
    });


    router.get('/categories', function (req, res) {   
    	Category.find({}, function(err, categories){
        	if(err) {
        		console.log(err);
        	}

        	var model = {
        		categories: categories
        	};

        	res.render('manage/categories/index', model);
        });            
    });


    router.get('/books/add', function (req, res) {
    	Category.find({}, function(err, categories) {
    		if(err) {
    			console.log(err);
    		}

    		var model = {
    			categories: categories
    		};

    		res.render('manage/books/add', model);
    	});
    });


    //add new book
    router.post('/books', function (req, res) {
    	//get variables from post
    	var title = req.body.title && req.body.title.trim();
    	var category = req.body.category && req.body.category.trim();
    	var author = req.body.author && req.body.author.trim();
    	var publisher = req.body.publisher && req.body.publisher.trim();
    	var price = req.body.price && req.body.price.trim();
    	var description = req.body.description && req.body.description.trim();
    	var cover = req.body.cover && req.body.cover.trim();

    	//do some error checking
    	if(title == '' || price == '') {
    		req.flash("error", "Please fill out required fields");
    		res.location('/manage/books/add');
    		res.redirect('/manage/books/add');
    	}

    	if(isNaN(price)) {
    		req.flash('error', "Price must be a number");
    		res.location('/manage/books/add');
    		res.redirect('/manage/books/add');
    	}

    	//create new book object
    	var newBook = new Book({
    		title: title,
    		category: category,
    		description: description,
    		author: author,
    		publisher: publisher,
    		cover: cover,
    		price: price
    	});

    	//save to database
    	newBook.save(function(err) {
    		if(err) {
    			console.log('save error', err);
    		}

    		req.flash('success', "Book added");
    		res.location('/manage/books');
    		res.redirect('/manage/books');
    	});
    });


	//display edit form
	router.get('/books/edit/:id', function (req, res) {
		Category.find({}, function(err, categories) {
			Book.findOne({_id:req.params.id}, function(err, book) {
				if(err) {
					console.log(err);
				}

				var model = {
					book: book,
					categories: categories
				}
				res.render('manage/books/edit', model);
			});
		});
	});


	//edit book
	router.post('/books/edit/:id', function (req, res) {
		var title = req.body.title && req.body.title.trim();
    	var category = req.body.category && req.body.category.trim();
    	var author = req.body.author && req.body.author.trim();
    	var publisher = req.body.publisher && req.body.publisher.trim();
    	var price = req.body.price && req.body.price.trim();
    	var description = req.body.description && req.body.description.trim();
    	var cover = req.body.cover && req.body.cover.trim();

		Book.update({_id: req.params.id}, {
			title: title,
			category: category,
			author: author,
			publisher: publisher,
			price: price,
			description: description,
			cover: cover
		}, function(err) {
			if(err) {
				console.log('update error', err);
			}

			req.flash('success', "Book updated");
			res.location('/manage/books');
			res.redirect('/manage/books');
		});
	});


	//delete book
	router.delete('/books/delete/:id', function (req, res) {
		Book.remove({_id: req.params.id}, function(err) {
			if(err) {
				console.log(err);
			}

			req.flash('success', "Book deleted");
			res.location('/manage/books');
			res.redirect('/manage/books');
		});
	});


	//display cateogry add form
	router.get('/categories/add', function (req, res) {
		res.render('/manage/categories/add');
	});


	//add a new category
	 router.post('/categories', function (req, res) {
    	//get variables from post
    	var name = req.body.name && req.body.name.trim();

    	//do some error checking
    	if(name == '') {
    		req.flash("error", "Please fill out required fields");
    		res.location('/manage/categories/add');
    		res.redirect('/manage/categories/add');
    	}

    	//create new category object
    	var newCategory = new Category({
    		name: name
    	});

    	//save to database
    	newCategory.save(function(err) {
    		if(err) {
    			console.log('save error', err);
    		}

    		req.flash('success', "Category added");
    		res.location('/manage/categories');
    		res.redirect('/manage/categories');
    	});
    });
};
