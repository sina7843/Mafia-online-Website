var express = require('express');
var router = express.Router();
const path = require('path');
const multer = require("multer");
const md5 = require('md5');
const user = require('../models/User');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/Avatars');
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage })
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('dashboard', { user: req.user });
});

router.post('/Update', upload.single("Avatar"), async (req, res, next) => {
  if (md5(req.body.opassword) === req.user.password) {
    let UpdateData = {
      Name: req.body.NickName ? req.body.NickName : req.user.name,
      Phone: req.body.Phone ? req.body.name : req.user.Phone,
      password: req.body.nPassword ? md5(req.body.nPassword) : req.user.password,
      avatar: req.file ? req.file.filename : req.user.avatar
    }
    try {
      await user.findByIdAndUpdate(req.user._id, UpdateData);
    }
    catch (e) {
      alert("Plz Recheck Phone OR Password And Then Retry");
      res.redirect('/Profile');
    }
    res.redirect('/Profile');
  }
  res.redirect('/Login');
}
);


router.get('/room', (req, res, next) => {
  res.render('roomlist')
})
module.exports = router;
