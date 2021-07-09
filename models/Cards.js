const mongoose = require('mongoose')

const cardchema = new mongoose.Schema({
   Name: {
      type: String,
      required: [true, 'Please Enter Your Name'],
   },
   Img: {
      type: String,
   },
   Action: {
      type: String,
   },
   Side: {
      type: String,
      enum: ['Mafia', 'Citizen', 'Neutral'],
      default: 'Citizen'
   }

})

const Card = mongoose.model('Card', cardchema)

module.exports = Card;