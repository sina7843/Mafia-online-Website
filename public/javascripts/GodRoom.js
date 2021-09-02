const socket = io('/');
const myPeer = new Peer(user._id, {
   host: 'sinakhalegha.ir',
   port: '3004',
});

let startbtn = document.getElementById("start");
let RoomSection = document.getElementById("Room");
let WaitingRoomSection = document.getElementById("WaitingRoom");
let sendbtn = document.getElementById("Send");
let msginput = document.getElementById("msg");
let chatbox = document.getElementById("chatBox");
let memberlist = document.getElementById("memberlist");
let nextbtn = document.getElementById('CR');
let eventSection = document.getElementById('Event');
let videoGrid = document.getElementById('videoGrid');
let myAudio = document.createElement('audio');
myAudio.muted = true;
let lastvote;
let members = {};
let membernum = 0;
let queue = [];
let aliveMafia = [];
let defendingQueue = []
let lastturn = '';
let turn = '';
let time = "Day";
let DayNumber = 0;


function addUser(user, stream) {
   let member = document.createElement("li");
   let img = document.createElement("IMG");
   img.setAttribute("src", `/Avatars/${user.avatar}`);
   let span = document.createElement("span");
   span.innerText = user.Name;
   member.appendChild(img); member.appendChild(span);
   members[user._id] = {};
   members[user._id].data = user
   members[user._id].html = member;
   memberlist.appendChild(member);
   membernum++;
   startbtn.innerText = membernum + "/" + room.MaxMember;

   let video = document.createElement("div");
   video.setAttribute("id", `video${user._id}`)
   video.classList.add("video");
   video.ondblclick = function () { kill(user._id); };
   let imgVideo = document.createElement("IMG");
   imgVideo.setAttribute("src", `/Avatars/${user.avatar}`);
   let spanVideo = document.createElement("span");
   spanVideo.innerText = user.Name;
   video.appendChild(imgVideo); video.appendChild(spanVideo);
   videoGrid.appendChild(video);
   if (stream) {
      const call = myPeer.call(user._id, stream);
      const audio = document.createElement('audio');
      call.on('stream', userAudio => {
         addAudioStream(audio, userAudio, user._id)
      })
      call.on('close', () => {
         audio.remove();
      })
      document.getElementById(`video${user._id}`).append(audio)
      members[user._id].call = call;
   }
}

function addAudioStream(audio, stream, userId) {
   audio.srcObject = stream
   audio.addEventListener('loadedmetadata', () => {
      audio.play()
   })
   audio.muted = true;
   audio.setAttribute("id", `audio${userId}`)

}



for (i in room.Members) {
   if (room.Members[i]._id !== user._id) addUser(room.Members[i], null);
}
navigator.mediaDevices.getUserMedia({
   video: false,
   audio: true
}).then(stream => {

   myPeer.on('call', call => {
      call.answer(stream);
      const audio = document.createElement('audio');
      call.on('stream', userAudio => {
         addAudioStream(audio, userAudio, call.peer);
      })
      document.getElementById(`video${call.peer}`).append(audio)
   })
   socket.on('user-connected', user => {
      addUser(user, stream);
   });
})
myPeer.on('open', id => {
   console.log(id, user._id);
   socket.emit('join-room', roomId, user, true)
})
socket.on('user-disconnected', user => {
   memberlist.removeChild(members[user._id].html);
   if (members[user._id].call) members[user._id].call.close();
   members[user._id] = undefined;
   membernum--;
   startbtn.innerText = membernum + "/" + room.MaxMember

});



sendbtn.onclick = (e) => {
   e.preventDefault();
   msg = msginput.value;
   msginput.value = "";
   socket.emit('SendMsg', roomId, user, msg);
   newmsg(user, msg, true)
}

socket.on('GetMsg', (user, msg) => {
   newmsg(user, msg, false)
})



let newmsg = (user, msg, self) => {
   let li = document.createElement("li");
   li.classList.add(self ? "Self" : "Other");
   let img = document.createElement("IMG");
   img.setAttribute("src", `/Avatars/${user.avatar}`);
   let span = document.createElement("span");
   let h1 = document.createElement("h1");
   h1.innerText = user.Name
   let p = document.createElement("p");
   p.innerText = msg;
   span.appendChild(h1); span.appendChild(p);
   li.appendChild(img); li.appendChild(span);
   chatbox.appendChild(li);
}

//GOD Part
startbtn.onmouseover = () => {
   startbtn.innerText = "Start Game";
}
startbtn.onmouseout = () => {
   startbtn.innerText = room.Members.length + "/" + room.MaxMember;
}
startbtn.onclick = () => {
   socket.emit('start', user);
}

socket.on('roles', (role) => {
   WaitingRoomSection.classList.add("hidden");
   RoomSection.classList.remove("hidden");
   for (i in role) {
      members[role[i].playerId].side = role[i].side;
      members[role[i].playerId].card = role[i].card;
      members[role[i].playerId].vote = [];
      members[role[i].playerId].alive = true;
      setSide(role[i].playerId, role[i].side, role[i].card);
      queue.push(role[i].playerId);
   }
});
function setSide(userid, side, card) {
   let video = document.getElementById(`video${userid}`);
   video.style.backgroundColor = (side === "Citizen") ? "white" : "#bc0410";
   let span = document.createElement("span");
   span.innerText = card;
   video.appendChild(span);
}

let votequeue = [];
nextbtn.onclick = () => {
   if (turn) {
      console.log(turn);
      try {
         document.getElementById(`audio${turn}`).muted = true;
         document.getElementById(`video${turn}`).style.border = "1px solid black";
      } catch (e) { }
   }
   if (time == "Day") {
      if (queue.length !== 0) {
         lastturn = turn;
         turn = queue.shift();
         votequeue.push(turn);
         try {
            document.getElementById(`audio${turn}`).muted = false;
            document.getElementById(`video${turn}`).style.border = "5px solid green";
         } catch (e) { }
         socket.emit("nextTurn", turn);
      }
      else {
         time = "Voting";
         timeChange()
         socket.emit("goVoting");
         lastvote = null;
         aliveMafia = [];
         for (i in members) {
            turn = '';
            if (members[i].side == "Mafia" && members[i].alive) {
               aliveMafia.push(members[i].data._id);
            }
         }

      }
   }
   else if (time == "Voting") {
      if (votequeue.length !== 0) {
         let voteTurn = votequeue.shift();
         if (lastvote != null || lastvote != undefined) {
            socket.emit("result", lastvote, members[lastvote].vote)
            for (i in members[lastvote].vote) {
               let li = document.createElement("li");
               li.innerText = `${members[lastvote].vote[i]} think ${members[lastvote].data.Name} is Mafia`
               eventSection.append(li);
            }
            let li = document.createElement("li");
            li.innerText = `${members[lastvote].data.Name}:${members[lastvote].vote.length}`
            eventSection.append(li);
         }
         lastvote = voteTurn;
         socket.emit("voteTo", voteTurn);
      }
      else {
         socket.emit("result", lastvote, members[lastvote].vote)
         for (i in members[lastvote].vote) {
            let li = document.createElement("li");
            li.innerText = `${members[lastvote].vote[i]} think ${members[lastvote].data.Name} is Mafia`
            eventSection.append(li);
         }
         let li = document.createElement("li");
         li.innerText = `${members[lastvote].data.Name}:${members[lastvote].vote.length}`
         eventSection.append(li);
         socket.emit("goDefending");
         time = "Defending"
         timeChange()
         console.log(membernum);
         defendingQueue = []
         for (i in members) {
            if (members[i].vote.length > Math.ceil(membernum / 2)) defendingQueue.push(members[i]);
         }
      }
   }
   else if (time == "Defending") {
      if (defendingQueue.length !== 0) {
         turn = defendingQueue.shift().data._id;
         votequeue.push(turn);
         members[turn].vote = [];
         try {
            document.getElementById(`audio${turn}`).muted = false;
            document.getElementById(`video${turn}`).style.border = "5px solid green";
         } catch (e) { }
         socket.emit("nextTurn", turn);
      }
      else {
         time = "DefendingVote";
         timeChange()
         socket.emit("goDefendingVote");
         try {
            document.getElementById(`audio${turn}`).muted = true;
            document.getElementById(`video${turn}`).style.border = "1px solid black";
         } catch (e) { }
         socket.emit("MafiaTalk", aliveMafia);
      }
   }
   else if (time == "DefendingVote") {
      if (votequeue.length !== 0) {
         let voteTurn = votequeue.shift();
         if (lastvote != null || lastvote != undefined) {
            socket.emit("result", lastvote, members[lastvote].vote)
            for (i in members[lastvote].vote) {
               let li = document.createElement("li");
               li.innerText = `${members[lastvote].vote[i]} think ${members[lastvote].data.Name} is Mafia`
               eventSection.append(li);
            }
            let li = document.createElement("li");
            li.innerText = `${members[lastvote].data.Name}:${members[lastvote].vote.length}`
            eventSection.append(li);
         }
         lastvote = voteTurn;
         socket.emit("voteTo", voteTurn);
      }
      else {
         socket.emit("result", lastvote, members[lastvote].vote)
         for (i in members[lastvote].vote) {
            let li = document.createElement("li");
            li.innerText = `${members[lastvote].vote[i]} think ${members[lastvote].data.Name} is Mafia`
            eventSection.append(li);
         }
         let li = document.createElement("li");
         li.innerText = `${members[lastvote].data.Name}:${members[lastvote].vote.length}`
         eventSection.append(li);
         socket.emit("goNigth");
         time = "Night"
         timeChange()
         console.log(membernum);
         defendingQueue = []
         for (i in members) {
            if (members[i].vote.length > Math.ceil(membernum / 2)) defendingQueue.push(members[i]);
         }
      }
   }
   else {
      socket.emit("goDay");
      DayNumber++;
      queue = [];
      if (DayNumber % 2 == 0) {
         for (i in members) {
            members[i].vote = [];
            if (members[i].alive) queue.push(i);
         }
      }
      else {
         for (i in members) {
            members[i].vote = [];
            if (members[i].alive) queue.unshift(i);
         }
      }
      socket.emit("MafiaStopTalk");
      time = "Day";
      timeChange()
   }
}
socket.on("playerVoted", (player, userid, vote) => {
   if (vote) members[userid].vote.push(player)
})

function kill(userId) {
   socket.emit("kill", userId);
   members[userId].alive = false;
   let AliveMafiaNumber = 0
   let players = [];
   document.getElementById(`video${userId}`).style.backgroundColor = "#242424";
   membernum--;
   for (i in members) {
      if (members[i].side === "Mafia") players.push(members[i].data.Name);
      if (members[i].alive && members[i].side === "Mafia") AliveMafiaNumber++
   }
   if (AliveMafiaNumber == 0) socket.emit("EndGame", "Citizen", players);
   else if (AliveMafiaNumber * 2 >= membernum) socket.emit("EndGame", "Mafia", players);
}

socket.on("Target", (first, target) => {
   let li = document.createElement('li');
   li.innerText = `${first.Name}(${members[first._id].card}) Choose ${target.Name}(${members[target._id].card})`;
   eventSection.appendChild(li);
})

function timeChange() {
   let li = document.createElement("li");
   li.innerText = `Now is ${time} time`
   eventSection.append(li);
}