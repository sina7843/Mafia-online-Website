var express = require('express');
var router = express.Router();
var md5 = require('md5');
var passport = require('passport');
const User = require('../models/User');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/SignUp', async (req, res, next) => {
  try {

    let newuser = new User({
      Name: req.body.Name,
      Email: req.body.Email,
      Phone: req.body.Phone,
      password: md5(req.body.Password)
    });
    await newuser.save();
    res.redirect('/Profile');
  }
  catch (err) {
    res.redirect('/login');
  }
})

router.get('/Login', function (req, res, next) {
  res.render('Login', { title: 'Express' });
});


router.post('/login', passport.authenticate('local', {
  successRedirect: '/Profile',
  failureRedirect: '/login',
}));

module.exports = router;
