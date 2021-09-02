const io = require("socket.io")();
let Game = require('./models/Game')
const socketapi = {
  io: io
};

io.on('connection', socket => {
  socket.on('join-room', (roomId, user, isGod) => {
    let my = user;
    if (!isGod) Game.findByIdAndUpdate(roomId, { $addToSet: { Members: user._id } }, (err, game) => { });
    socket.join("room:" + roomId)
    socket.join("usr:" + user._id)
    if (!isGod) socket.to("room:" + roomId).emit('user-connected', user, isGod)
    socket.on('SendMsg', (roomId, user, msg) => {
      socket.to("room:" + roomId).emit('GetMsg', user, msg)
    })
    socket.on('disconnect', () => {
      if (!isGod) Game.findByIdAndUpdate(roomId, { $pull: { Members: user._id } }, (err, game) => { });
      if (!isGod) socket.to("room:" + roomId).emit('user-disconnected', user)
    })
    socket.on('start', async (god) => {
      let game = await Game.findByIdAndUpdate(roomId, { Stat: 'Start' });
      let players = [];
      let num = {
        Mafia: Math.floor(game.Members.length / 3),
        Citizen: game.Members.length - Math.floor(game.Members.length / 3),
        Player: game.Members.length
      }
      let CitizenCards = new Array(num.Citizen).fill('Citizen'); CitizenCards[0] = "Doctor"; CitizenCards[1] = "Detective"
      let MafiaCards = new Array(num.Mafia).fill('Mafia'); MafiaCards[0] = "GodFather";
      for (i in game.Members) {
        let r = Math.ceil(Math.random() * num.Player);
        if (r <= num.Mafia) {
          r -= 1;
          let card = MafiaCards[r];
          players.push({
            playerId: game.Members[i],
            side: "Mafia",
            card: card
          });
          MafiaCards.splice(r, 1);
          num.Mafia--;
          socket.to("usr:" + game.Members[i]).emit('role', "Mafia", card);
        }
        else {
          r = r - num.Mafia - 1;
          let card = CitizenCards[r]
          players.push({
            playerId: game.Members[i],
            side: "Citizen",
            card: card
          });
          CitizenCards.splice(r, 1);
          num.Citizen--;
          socket.to("usr:" + game.Members[i]).emit('role', "Citizen", card);
        }
        num.Player--;
      }
      io.in("usr:" + god._id).emit('roles', players);
    });
    socket.on('nextTurn', nextPlayerId => {
      socket.to("room:" + roomId).emit('TurnChange', nextPlayerId)
    })

    socket.on('goVoting', () => {
      socket.to("room:" + roomId).emit('Voting');
    })

    socket.on("voteTo", userId => {
      socket.to("room:" + roomId).emit('vote', userId);
    })

    socket.on("voted", (userid, isMafia, God) => {
      socket.to("usr:" + God).emit("playerVoted", my.Name, userid, isMafia);
    })
    socket.on('result', (user, result) => {
      socket.to("room:" + roomId).emit('voteResult', user, result);
    })
    socket.on('goDefending', () => {
      socket.to("room:" + roomId).emit('Defending')
    })
    socket.on('goNight', () => {
      socket.to("room:" + roomId).emit('Night')
    });
    socket.on('goDay', () => {
      socket.to("room:" + roomId).emit('Day')
    })

    socket.on('MafiaTalk', (Mafias) => {
      for (i in Mafias) {
        socket.to("usr:" + Mafias[i]).emit('MafiaTurn', Mafias);
      }
      socket.on("MafiaStopTalk", () => {
        socket.to("usr:" + Mafias[i]).emit('MafiaStop');
      })
    })
    socket.on('goDefendingVote', () => {
      socket.to("room:" + roomId).emit('DefendingVote')
    })
    socket.on('kill', userId => {
      socket.to("room:" + roomId).emit('Dead', userId);
    })

    socket.on('Choose', (first, target, God) => {
      socket.to("usr:" + God).emit("Target", first, target);
    })
    socket.on('EndGame', (WinnerSide, player) => {
      socket.to("room:" + roomId).emit('End', WinnerSide, player);
    })
    socket.on("pvTalk",(msg,id)=>{
      socket.to("usr:"+id).emit("GodTalk" , msg);
    } )
    socket.on("like" , userId=>{
      io.in("room:" + roomId).emit('pLike', userId)
    })
    socket.on("dislike" , userId=>{
      io.in("room:" + roomId).emit('pdisLike', userId)
    })
  });
});

module.exports = socketapi;