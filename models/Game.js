const mongoose = require('mongoose')

const gamechema = new mongoose.Schema({
   Name: {
      type: String,
      required: [true, 'Please Enter Your Name'],
   },
   MaxMember: {
      type: Number,
      required: [true, 'Please Enter MaxMember']
   },
   GameType: {
      type: String,
      enum: ['Classic', 'Nigth'],
      default: 'Classic'
   },
   Stat: {
      type: String,
      enum: ["Waiting", "Start", "Ended"],
      default: 'Waiting'
   },
   God: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   Cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
   Private: {
      type: String,
      enum: ["Private", "General"],
   },
   password: {
      type: String,
      select: false
   },
   Members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
   WinnerSide: {
      type: String,
      enum: ['Mafia', 'Citizen', 'Neutral'],
      default: 'Citizen'
   }

}, {
   timestamps: true
})

const Game = mongoose.model('game', gamechema)

module.exports = Game;