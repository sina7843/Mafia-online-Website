const mongoose = require('mongoose')

const lvlSchema = new mongoose.Schema({
   Name: {
      type: String,
      required: [true, 'Please Enter Your Name'],
   },
   Badget: {
      type: String,
   },
   xpRange: {
      min: Number,
      max: Number
   }
})

const lvl = mongoose.model('lvl', lvlSchema)

module.exports = lvl;