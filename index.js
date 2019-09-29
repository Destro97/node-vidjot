const express = require('express');
const app = express();
// Mongoose(MongoDB import)
const mongoose = require('mongoose');

//static files
const path = require('path');

// require passport
const passport = require('passport');

// Session
const session = require('express-session');
//Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Flash messaging
const flash = require('connect-flash');
app.use(flash());

// Middleware for static files
app.use(express.static(path.join(__dirname, 'public')));

// passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables for flash messaging
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// make connection with db
const a = mongoose.connect('mongodb://localhost/vidjot-dev', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', ()=> {
  console.log(`${db.name} connection established`);
});


// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//
// require('./models/Idea');
// const Idea = mongoose.model('idea');
// const id1 = new Idea({
//   title: 'test-title',
//   details: 'test-details'
// });
// id1.save((err)=>{
//   if(!err){
//     console.log('Success')
//   }
// });
// q = Idea.findOne(
//   {
//     details: 'test-details'
//   },
//   (err, id) => {
//     if(err){
//       console.log(err);
//     }
//     else{
//       console.log(id);
//     }
//   }
// );
// q.forEach((id)=>{
//   console.log(id.title+'====='+id.details);
// });
// .then( (err, db) => console.log(typeof(db)))
// .catch( err => console.log(err));


// Middleware
// app.use(function(req, res, next){
//   console.log(Date.now());
//   req.name = 'Destro';
//   next();
// });

// Handlebars Middleware
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Index Route
// app.get('/', (req, res) => {
//   res.send(`INDEX of ${req.name}`);
// });

app.get('/', (req, res) => {
  res.render('index', {
    "test-key": "test-val"
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// app.get('/ideas/add', (req, res) => {
//   res.render('ideas/add');
// });
//
// app.get('/ideas/edit/:id', (req, res) => {
//   Idea.findOne({
//     '_id': req.params.id
//   })
//   .then( idea => {
//     res.render('ideas/edit', {
//       idea: idea
//     });
//   });
// });
//
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//
// app.get('/ideas', (req, res) => {
//   Idea.find({})
//     .sort({date: 'desc'})
//     .then( ideas => {
//       res.render('ideas/index', {
//         ideas: ideas
//       });
//     });
// });
//
// app.post('/ideas', (req, res) => {
//   let errors = [];
//
//   if(!req.body.title){
//     errors.push({"message": "Please add a Title"})
//   }
//   if(!req.body.details){
//     errors.push({"message": "Please add some Details"})
//   }
//   if(errors.length){
//     res.render('ideas/add', {
//       errors: errors,
//       title: req.body.title,
//       details: req.body.details
//     });
//   }
//   else{
//     // new Idea(req.body); can be done this way in this case
//     const newUser = {
//       title: req.body.title,
//       details: req.body.details
//     }
//     new Idea(newUser)
//       .save()
//       .then( idea => {
//         res.redirect('/ideas');
//       })
//   }
// });
//
var methodOverride = require('method-override')
app.use(methodOverride('_method'))
//
// app.put('/ideas/:id', (req, res) => {
//   Idea.findOne({
//     _id: req.params.id
//   })
//     .then( idea => {
//       idea.title = req.body.title;
//       idea.details = req.body.details;
//
//       idea.save()
//         .then( idea => {
//           res.redirect('/ideas');
//         })
//     });
// });
//
// app.delete('/ideas/:id', (req, res) => {
//   Idea.deleteOne({
//     _id: req.params.id
//   })
//     .then( () => {
//       res.redirect('/ideas');
//     });
// });
//
// app.get('/users/login', (req, res) => {
//   res.send('Login');
// });
//
// app.get('/users/register', (req,res) => {
//   res.send('Register');
// });
// Use /idas router
app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
