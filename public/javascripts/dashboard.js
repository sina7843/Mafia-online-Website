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
   // var form = $('#UpdateForm');
   // var url = form.attr('action');
   // var fd = new FormData($('#img-avatar')[0].files[0]);
   // console.log($('#img-avatar')[0].files[0]);
   // //fd.append("CustomField", "This is some extra data");
   // $.ajax({
   //    url: url,
   //    type: 'POST',
   //    data: fd,
   //    error: function (a, b, c) { alert(c); },
   //    success: function (data) {
   //       alert(data);
   //    },
   //    cache: false,
   //    contentType: false,
   //    processData: false
   // });
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
   console.log(inputAvatar)
   inputAvatar.click();
}

function preview() {
   ChangeAvatar.src = URL.createObjectURL(event.target.files[0]);
}

function OpenModel() {
   modal.open();
}