const io = require("socket.io")();
let Game = require('./Models/Game')
const socketapi = {
  io: io
};

io.on('connection', socket => {
  socket.on('join-room', (roomId, user,stream ,isGod) => {
    if (!isGod) Game.findByIdAndUpdate(roomId, { $addToSet: { Members: user._id } }, (err, game) => { });
    socket.join("room:" + roomId)
    socket.join("usr:" + user._id)
    socket.to("room:" + roomId).emit('user-connected', user,stream,isGod)
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
      for (i in game.Members) {
        let r = Math.ceil(Math.random() * num.Player);
        if (r <= num.Mafia) {
          players.push({
            playerId: game.Members[i],
            side: "Mafia"
          });
          num.Mafia--;
          socket.to("usr:" + game.Members[i]).emit('role', "Mafia");
        }
        else {
          players.push({
            playerId: game.Members[i],
            side: "Citizen"
          });
          num.Citizen--;
          socket.to("usr:" + game.Members[i]).emit('role', "Citizen");
        }
        num.Player--;
      }
      io.in("usr:" + god._id).emit('roles', players);
    });
  })
})

module.exports = socketapi;