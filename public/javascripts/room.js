const socket = io('/')
const myPeer = new Peer(user._id, {
   host: '/',
   port: '3004',
});

let startbtn = document.getElementById("start");
let RoomSection = document.getElementById("Room");
let WaitingRoomSection = document.getElementById("WaitingRoom");
let sendbtn = document.getElementById("Send");
let msginput = document.getElementById("msg");
let eventList = document.getElementById("Event");
let chatbox = document.getElementById("chatBox");
let memberlist = document.getElementById("memberlist");
let nextbtn = document.getElementById('CR');
let videoGrid = document.getElementById('videoGrid');
let myAudio = document.createElement('audio');
let likebtn = document.getElementById('like');
let dislikebtn = document.getElementById('dislike');

let card = "";
myAudio.muted = true;
let members = {};
let membernum = 0;
let queue = [];
let turn = '';
let time = "Day";

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
   video.style.backgroundColor = "white";
   video.setAttribute("id", `video${user._id}`)
   video.classList.add("video");
   video.ondblclick = function () { Choose(user); };
   let imgVideo = document.createElement("IMG");
   imgVideo.setAttribute("src", `/Avatars/${user.avatar}`);
   let spanVideo = document.createElement("span");
   spanVideo.innerText = user.Name;
   let likeSymbol = document.createElement("i");
   likeSymbol.classList.add("fas","fa-thumbs-up","hidden")
   let disLikeSymbol = document.createElement("i");
   disLikeSymbol.classList.add("fas","fa-thumbs-down","hidden")
   video.appendChild(imgVideo); video.appendChild(spanVideo);video.appendChild(disLikeSymbol);video.appendChild(likeSymbol);
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
      members[user._id].call = call;
   }
   members[user._id].video = video;
}

function addAudioStream(audio, stream, userId) {
   audio.srcObject = stream
   audio.addEventListener('loadedmetadata', () => {
      audio.play()
   })
   audio.muted = true;
   audio.setAttribute("id", `audio${userId}`)
   console.log(audio);
   try {
      document.getElementById(`video${userId}`).append(audio);
   } catch (e) { }
}



for (i in room.Members) {
   if (room.Members[i]._id !== user._id) addUser(room.Members[i], null);
}
navigator.mediaDevices.getUserMedia({
   video: false,
   audio: true
}).then(stream => {
   addUser(user, null)
   myPeer.on('call', call => {
      call.answer(stream);
      const audio = document.createElement('audio');
      call.on('stream', userAudio => {
         addAudioStream(audio, userAudio, call.peer);
      })
   })
   socket.on('user-connected', user => {
      addUser(user, stream);
   });
})
myPeer.on('open', id => {
   console.log(id, user._id);
   socket.emit('join-room', roomId, user, false)
})
socket.on('user-disconnected', user => {
   memberlist.removeChild(members[user._id].html);
   videoGrid.removeChild(members[user._id].video)
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

//player part

likebtn.onclick = ()=>{
   socket.emit("like" , user._id);
   likebtn.disabled = true;
   dislikebtn.disabled = true;
   setTimeout(function(){dislikebtn.disabled = false;likebtn.disabled =false;}, 3000);
}
socket.on("pLike", userID=>{
   document.getElementById(`video${userID}`).getElementsByClassName("fa-thumbs-up")[0].classList.remove("hidden");
   setTimeout(function(){ document.getElementById(`video${userID}`).getElementsByClassName("fa-thumbs-up")[0].classList.add("hidden");}, 3000);
})

dislikebtn.onclick = ()=>{
   socket.emit("dislike" , user._id);
   likebtn.disabled = true;
   dislikebtn.disabled = true;
   setTimeout(function(){dislikebtn.disabled = false;likebtn.disabled =false;}, 3000);
}
socket.on("pdisLike", userID=>{
   document.getElementById(`video${userID}`).getElementsByClassName("fa-thumbs-down")[0].classList.remove("hidden");
   setTimeout(function(){ document.getElementById(`video${userID}`).getElementsByClassName("fa-thumbs-down")[0].classList.add("hidden");}, 3000);
})

socket.on('role', (role, card) => {
   WaitingRoomSection.classList.add("hidden");
   RoomSection.classList.remove("hidden");
   Swal.fire(
      `Your Side is '${role}'`,
      `you Play As '${card}'`,
      'success'
   )
   card = card;
});

socket.on('TurnChange', (newPlayerTurn) => {
   if (turn) {
      try {
         if (turn != user._id) document.getElementById(`audio${turn}`).muted = true;
         document.getElementById(`video${turn}`).style.border = "1px solid black";
      } catch (e) { }
   }
   turn = newPlayerTurn;
   try {
      document.getElementById(`video${turn}`).style.border = "5px solid green";
      if (turn != user._id) document.getElementById(`audio${turn}`).muted = false;
   } catch (e) { }
})

socket.on("Dead", userId => {
   let li = document.createElement("li");
   li.innerText = `${members[userId].data.Name} Now is Dead`
   eventList.append(li);
   members[userId].alive = false
   document.getElementById(`video${userId}`).style.backgroundColor = "#242424";
   membernum--;
});

function Choose(choosenUser) {
   socket.emit("Choose", user, choosenUser, room.God)
}

socket.on("End", (WinnerSide, players) => {
   console.log(players);
   Swal.fire(
      `${WinnerSide} Wins The Game`,
      `Mafia : ${players.join(',')}`
   )
})

//Mafiapart
socket.on('MafiaTurn', Mafias => {
   for (i in Mafias) {
      if (Mafias[i] != user._id) document.getElementById(`audio${Mafias[i]}`).muted = false;
   }
   socket.on('MafiaStop', () => {
      for (i in Mafias) {
         if (Mafias[i] != user._id) document.getElementById(`audio${Mafias[i]}`).muted = true;
      }
   })
})

socket.on("Voting", () => {
   if (turn) {
      console.log(turn);
      if (turn != user._id) document.getElementById(`audio${turn}`).muted = true;
      document.getElementById(`video${turn}`).style.border = "1px solid black";
   }
   time = "Voting";
   timeChange()
})

socket.on("vote", userid => {
   Swal.fire({
      title: `Are You think ${members[userid].data.Name} is Mafia`,
      showDenyButton: true,
      confirmButtonText: `Citizen`,
      denyButtonText: `Mafia`,
   }).then((result) => {
      if (result.isConfirmed) {
         socket.emit("voted", userid, false, room.God);
      } else if (result.isDenied) {
         socket.emit("voted", userid, true, room.God);
      }
   })
})
socket.on("voteResult", (user, number) => {

   for (i in number) {
      let li = document.createElement("li");
      li.innerText = `${number[i]} think ${members[user].data.Name} is Mafia`
      eventList.append(li);
   }
   let li = document.createElement("li");
   li.innerText = `${members[user].data.Name}:${number.length}`
   eventList.append(li);

})

socket.on('Defending', () => {
   time = "Defending";
   timeChange()
})

socket.on('Night', () => {
   time = "Night";
   timeChange()
})

socket.on('Day', () => {
   time = "Day";
   timeChange()
})
socket.on('DefendingVote', () => {
   time = "DefendingVote";
   timeChange()
})

function timeChange() {
   let li = document.createElement("li");
   li.innerText = `Now is ${time} time`
   eventList.append(li);
}

socket.on("GodTalk" , msg=>{
   console.log(msg);
   let li = document.createElement("li");
   li.innerText = `God: ${msg.value}`
   eventList.append(li);
})