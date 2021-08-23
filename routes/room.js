var express = require('express');
var router = express.Router();
let Game = require('../Models/Game')

router.get('/', async (req, res, next) => {
   let game = await Game.find({ Stat: 'Waiting' });
   res.render('roomlist', { rooms: game, types: ['Classic', 'Nigth'], Avatar: req.user.avatar });
})
router.post('/create', async (req, res, next) => {
   let newGame = new Game({
      Name: req.body.Name,
      MaxMember: req.body.MaxMember,
      GameType: req.body.GameType,
      God: req.user._id,
      Private: req.body.Private ? "Private" : "General",
      password: req.body.Private ? req.body.Password : null
   })
   await newGame.save();
   res.redirect('/room');
})

router.get('/:id', async (req, res, next) => {
   let game = await Game.findById(req.params.id).populate("Members");
   if (game.God + '' === req.user._id + '') res.render('GodRoom', { roomId: req.params.id, user: req.user, game })
   else res.render('room', { roomId: req.params.id, user: req.user, game })
})

module.exports = router;
