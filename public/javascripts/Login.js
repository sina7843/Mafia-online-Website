let btnRegister = document.getElementById('btnRegister');
let btnSignIn = document.getElementById('btnSignIn');
let frmSignIn = document.getElementById('login');
let frmRegister = document.getElementById('SignUp');

btnRegister.onclick = () => {
   frmRegister.style.visibility = "visible"; frmRegister.style.opacity = "1"
   frmSignIn.style.visibility = "hidden"; frmSignIn.style.opacity = "0"
   document.body.style.background = "url(../images/signup.png)"
   document.body.style.backgroundSize = "100% 100%";
}

btnSignIn.onclick = () => {
   frmRegister.style.visibility = "hidden"; frmRegister.style.opacity = "0"
   frmSignIn.style.visibility = "visible"; frmSignIn.style.opacity = "1"
   document.body.style.background = "url(../images/login.png)";
   document.body.style.backgroundSize = "100% 100%";
}