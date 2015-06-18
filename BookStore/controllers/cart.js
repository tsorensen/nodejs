'use strict';
var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');

module.exports = function (router) {
    router.get('/', function (req, res) {           
        //get cart from session
        var cart = req.session.cart;
        var displayCart = {items:[], total:0};
        var total = 0;

        //get total
        for(var item in cart) {
            displayCart.items.push(cart[item]);
            total += (cart[item].qty * cart[item].price);
        }   

        displayCart.total = total;

        //render cart
        res.render('cart/index', {
            cart: displayCart
        });
    });

    router.post('/:id', function (req, res) {           
        req.session.cart = req.session.cart || {};
        var cart = req.session.cart;

        Book.findOne({_id: req.params.id}, function(err, book) {
            if(err) {
                console.log(err)
            }

            if(cart[req.params.id]) {
                cart[req.params.id].qty++;
            } else {
                cart[req.params.id] = {
                    item: book._id,
                    title: book.title,
                    price: book.price,
                    qty: 1,
                    _id: book._id
                }
            }

            res.redirect('/cart');
        });     
    });


    //empty cart 
    router.get('/remove', function (req, res) {
        req.session.cart = null;

        req.flash('success', "Your cart items have been removed");
        res.location('/cart');
        res.redirect('/cart');
    });


    //remove cart item
    router.get('/removeItem/:id', function (req, res) {
        req.session.cart = req.session.cart || {};
        var cart = req.session.cart;
        var item = req.session.cart[req.params.id];

        console.log(cart);
        console.log(item);

        if(item.qty > 1) {
            item.qty = item.qty - 1;
        } else {
            delete req.session.cart[req.params.id];
        }
        
        req.flash('success', "Item removed");
        res.location('/cart');
        res.redirect('/cart');
    });

};

