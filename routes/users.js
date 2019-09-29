const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

require('../models/User');
const User = mongoose.model('user');

// router.use(passport.initialize());

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req,res) => {
  res.render('users/register');
});

// Register form method
router.post('/register', (req, res) => {
  let errors = [];
  if(req.body.password !=req.body.password2){
    errors.push({
      message: "Passwords don't match"
    })
  }

  if(req.body.password.length < 4){
    errors.push({
      message: "Passwords should be atleast 4 characters"
    })
  }

  if(errors.length > 0){
    console.log('here');
    req.body['errors'] = errors;
    console.log(req.body);
    res.render('users/register', req.body);
  } else {
    User.findOne({
      email: req.body.email
    })
      .then( user => {
        if (user) {
          req.flash('error_msg', 'Email already registered with an account!');
          res.redirect('/users/register');
        } else {
          const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          }
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              new User(newUser)
                .save()
                .then( user => {
                  req.flash('success_msg', 'Registration successful. You can now log in!');
                  res.redirect('/users/login');
                })
                .catch( err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      })
  }
});

// Login form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You have been logged out successfully');
  res.redirect('/users/login');
});

module.exports = router;
