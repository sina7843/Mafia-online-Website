$('.dropdown-el').click(function (e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).toggleClass('expanded');
  $('#' + $(e.target).attr('for')).prop('checked', true);
  queryfunction();
});

$(document).click(function () {
  queryfunction();
  $('.dropdown-el').removeClass('expanded');
});
$('#createbutton').click((e) => {
  e.preventDefault();
  $('#popup-background').toggleClass('hidden');
})

$('#closepopup').click(() => {
  $('#popup-background').toggleClass('hidden');
})

$('#Private').click(function () {
  if (this.checked) {
    $('#Password').prop('disabled', false); // If checked enable item       
  } else {
    $('#Password').prop('disabled', true); // If checked disable item                   
  }
});

let roomtable = document.getElementById('ROOMS');
let searchInput = document.getElementById('searchbar');
let radios = document.getElementsByName('Type');

let queryfunction = () => {
  let filterType;
  console.log(radios);
  for (let i = 0, length = radios.length; i < length; i++) {
    console.log(radios[i].checked);
    if (radios[i].checked) {
      filterType = (radios[i].value);
      break;
    }
  }
  let filteredRoom = [];
  let filterQuery = searchInput.value;
  console.log(filterType)
  for (i in Rooms) {
    if ((filterType === "all" || filterType === Rooms[i].GameType) && Rooms[i].Name.indexOf(filterQuery) > -1) {
      filteredRoom.push(Rooms[i])
    }
  }
  let newBody =
    `<tbody><tr>
    <th>#</th>
    <th>Room Name</th>
    <th>Game Type</th>
    <th>Members</th>
    <th>Private</th>
    <th>Join</th>
  </tr>`
  for (let i = 0; i < filteredRoom.length; i++) {
    newBody +=
      `<tr>
      <td>${i + 1}</td>
      <td>${filteredRoom[i].Name}</td>
      <td>${filteredRoom[i].GameType}</td>
      <td>${filteredRoom[i].Members.length} / ${filteredRoom[i].MaxMember}</td>
      <td>${(filteredRoom[i].Private === "General") ? '<i class="fas fa-unlock"></i>' : '<i class="fas fa-lock"></i>'}</td>
      <td><a href="/room/${filteredRoom[i]._id}"class="joinbutton">Join</button></td>
    </tr > `
  }
  newBody += "</tbody>"
  ROOMS.innerHTML = newBody;
}

searchInput.oninput = queryfunction;
queryfunction();