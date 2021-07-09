const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
   Name: {
      type: String,
      required: [true, 'Please Enter Your Name'],
   },
   Email: {
      type: String,
      required: [true, 'Please Enter Your Email'],
      unique: [true, 'This Email Has Already been submitted']
   },
   Phone: {
      type: String,
      required: [true, 'Please Enter Your Phone Number'],
      unique: [true, 'This Phone Number Has Already been submitted']
   },
   password: {
      type: String,
      required: [true, 'Please Provide a Password'],
      select: false
   },
   GamePlayed: {
      type: Number,
      default: 0
   },
   GameWon: {
      type: Number,
      default: 0
   },
   GameLose: {
      type: Number,
      default: 0
   },
   GameAsMafia: {
      type: Number,
      default: 0
   },
   GameAsCitizen: {
      type: Number,
      default: 0
   },
   GameAsNeutral: {
      type: Number,
      default: 0
   },
   XP: {
      type: Number,
      default: 0
   }
}, {
   timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User;