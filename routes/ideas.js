const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Require helper for authentication
const { ensureAuthenticated } = require('../helpers/auth');

require('../models/Idea');
const Idea = mongoose.model('idea');

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    '_id': req.params.id
  })
  .then( idea => {
    if (idea.user != req.user.id) {
      req.flash('error_msg', 'Not Authorised.');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea: idea
      });
    }
  });
});

// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({
    user: req.user.id
  })
    .sort({date: 'desc'})
    .then( ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({"message": "Please add a Title"})
  }
  if(!req.body.details){
    errors.push({"message": "Please add some Details"})
  }
  if(errors.length){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  }
  else{
    // new Idea(req.body); can be done this way in this case
    const newIdea = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Idea(newIdea)
      .save()
      .then( idea => {
        req.flash('success_msg', 'Idea saved successfully');
        res.redirect('/ideas');
      })
  }
});

// var methodOverride = require('method-override')
// app.use(methodOverride('_method'))

router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then( idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save()
        .then( idea => {
          req.flash('success_msg', 'Idea updated successfully');
          res.redirect('/ideas');
        })
    });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.deleteOne({
    _id: req.params.id
  })
    .then( () => {
      req.flash('success_msg', 'Idea deleted successfully');
      res.redirect('/ideas');
    });
});

module.exports = router;
