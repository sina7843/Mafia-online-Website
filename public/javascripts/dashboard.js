var modal = new tingle.modal({
   footer: true,
   stickyFooter: false,
   closeMethods: [],
   beforeClose: function () { return true; }
});

// set content
modal.setContent(`<form class="form" id="UpdateForm" action="./Profile/Update" method="post"  enctype="multipart/form-data">
                     <img src="${AvatarUrl}" class="Avatar" id="img-avatar">
                     <input accept="image/*" onchange="preview()" id="Avatar" type="file" name="Avatar" style="display: none;" />
                     <input class="input" type="text" name="NickName" id="NickName" placeholder="New Name">
                     <input class="input" type="password" name="oPassword" id="oPassword" placeholder="Old Password">
                     <input class="input" type="password" name="nPassword" id="nPassword" placeholder="New Password">
                     <input class="input" type="Number" name="Phone" id="Phone" placeholder="New Phone Number" pattern="+[0-9]{12}">
                  </form>`);

// add a button
modal.addFooterBtn('Save', 'tingle-btn tingle-btn--primary', function () {
   let updateform = document.getElementById('UpdateForm');
   updateform.submit();
   modal.close();
});

// add another button
modal.addFooterBtn('Cancel', 'tingle-btn tingle-btn--danger', function () {
   modal.close();
});

// open modal



let ChangeAvatar = document.getElementById('img-avatar');
let inputAvatar = document.getElementById('Avatar')
ChangeAvatar.onclick = () => {
   
   inputAvatar.click();
}

function preview() {
   ChangeAvatar.src = URL.createObjectURL(event.target.files[0]);
}

function OpenModel() {
   modal.open();
}