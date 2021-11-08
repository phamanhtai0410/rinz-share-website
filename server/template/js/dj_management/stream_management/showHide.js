const toggleKey = document.querySelector('#toggleKey');
const toggleUsername = document.querySelector('#toggleUsername');
const togglePassword = document.querySelector('#togglePassword');

const key = document.querySelector('#key');
const username = document.querySelector('#username');
const password = document.querySelector('#password');

toggleKey.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = key.getAttribute('type') === 'password' ? 'text' : 'password';
    key.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});

toggleUsername.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = username.getAttribute('type') === 'password' ? 'text' : 'password';
    username.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});

togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});

const copyServer = document.querySelector('#copyServer');
const copyKey = document.querySelector('#copyKey');
const copyUsername = document.querySelector('#copyUsername');
const copyPassword = document.querySelector('#copyPassword');

const server = document.querySelector("#server");

copyServer.addEventListener('click', function (e) {
    var serverText = server.textContent;
    // server.select();
    // server.setSelectionRange(0, 99999);
    // navigator.clipboard.writeText(serverText);
    copyToClipboard(serverText);
    document.getElementById("custom-tooltip-server").style.display = "inline";
    document.execCommand("copy");
    setTimeout( function() {
        document.getElementById("custom-tooltip-server").style.display = "none";
    }, 1000);

});

copyKey.addEventListener('click', function (e) {
    var keyText = key.value;
    // key.select();
    // key.setSelectionRange(0, 99999);
    copyToClipboard(keyText);
    // navigator.clipboard.writeText(keyText);
    document.getElementById("custom-tooltip-key").style.display = "inline";
    document.execCommand("copy");
    setTimeout( function() {
        document.getElementById("custom-tooltip-key").style.display = "none";
    }, 1000);

});

copyUsername.addEventListener('click', function (e) {
    var usernameText = username.value;
    // username.select();
    // username.setSelectionRange(0, 99999);
    copyToClipboard(usernameText);
    // navigator.clipboard.writeText(usernameText);
    document.getElementById("custom-tooltip-username").style.display = "inline";
    document.execCommand("copy");
    setTimeout( function() {
        document.getElementById("custom-tooltip-username").style.display = "none";
    }, 1000);

});

copyPassword.addEventListener('click', function (e) {
    var passwordText = password.value;
    // password.select();
    // password.setSelectionRange(0, 99999);
    copyToClipboard(passwordText);
    // navigator.clipboard.writeText(passwordText);
    document.getElementById("custom-tooltip-password").style.display = "inline";
    document.execCommand("copy");
    setTimeout( function() {
        document.getElementById("custom-tooltip-password").style.display = "none";
    }, 1000);

});