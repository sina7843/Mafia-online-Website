const socket = io('/')
const myPeer = new Peer(user._id , {
   host : '/',
   port : '3002'
});

let startbtn = document.getElementById("start");
let RoomSection = document.getElementById("Room");
let WaitingRoomSection = document.getElementById("WaitingRoom");
let sendbtn = document.getElementById("Send");
let msginput = document.getElementById("msg");
let chatbox = document.getElementById("chatBox");
let memberlist = document.getElementById("memberlist");

let members = {};
let membernum = 0;

socket.on('user-connected', user  => {
   addUser(user);
});
addUser(user);


socket.emit('join-room', roomId, user,false)

socket.on('user-disconnected', user => {
   memberlist.removeChild(members[user._id].html);
   if (members[user._id].call) members[user._id].call;
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

function addUser(user ,stream) {
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
}

for (i in room.Members) {
   if (room.Members[i]._id !== user._id) addUser(room.Members[i]);
}

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

// function streamAudio(player , stream){
//    let video = document.createElement("div");
//    video.classList.add("video");
//    let img = document.createElement("IMG");
//    img.setAttribute("src", `/Avatars/${player.avatar}`);
//    let span = document.createElement("span");
//    span.innerText = player.Name;
//    let audio = document.createElement('audio');
//    audio.setAttribute("id" , "audio:"+player._id); 
//    const call = myPeer.call(player._id,stream);
//    call.on('stream',userAudioStream =>{
//       audio.src = window.URL.createObjectURL(userAudioStream);
//       audio.onloadedmetadata = function(e){
//          console.log('now playing the audio');
//          audio.play();
//       }
//    });
//    call.on('close' , ()=>{
//       audio.remove();
//    })
//    video.appendChild(img); video.appendChild(span);video.classList.appendChild(audio);
//    videoGrid.appendChild(video);
// }



//player part
socket.on('role', (role) => {
   WaitingRoomSection.classList.add("hidden");
   RoomSection.classList.remove("hidden");
   console.log(role);
});